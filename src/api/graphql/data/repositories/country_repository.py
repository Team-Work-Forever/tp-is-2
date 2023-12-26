from data.repositories.base_repository import BaseRepository

class CountryRepository(BaseRepository):
    def __init__(self, map_entities):
        super().__init__()

        self._MAP_ENTITIES = map_entities

    def create(self, name):
        cursor = self._db_context.get_cursor()

        cursor.execute(""" 
            INSERT INTO country (name)
            VALUES (%s)
            RETURNING *
            """, (name,)
        )

        self._db_context.commit()
        return self._map_to_entity(cursor.fetchone(), 'country')
    
    def create_many_regions(self, regions, country_id):
        cursor = self._db_context.get_cursor()

        for region in regions:
            cursor.execute(""" 
                INSERT INTO region (name, province, country_id)
                VALUES (%s, %s, %s)
                RETURNING *
                """, (region.name, region.province, country_id)
            )

        self._db_context.commit()
        return self._map_to_entity_collection(cursor.fetchall(), 'region')

    def get_regions_from_country(self, country_id, mapper = 'region'):
        cursor = self._db_context.get_cursor()

        cursor.execute(""" 
            SELECT
                region.id,
                region.name,
                region.province,
                region.created_at,
                region.updated_at,
                region.deleted_at
            FROM region
            WHERE region.country_id = %s
            """, (country_id,)
        )

        return self._map_to_entity_collection(cursor.fetchall(), mapper)
    
    def get_region_by_name(self, name: str, mapper = 'region'):
        cursor = self._db_context.get_cursor()

        cursor.execute(""" 
            SELECT
                region.id,
                region.name,
                region.province,
                region.created_at,
                region.updated_at,
                region.deleted_at
            FROM region
            WHERE region.name = %s
            """, (name,)
        )

        return self._map_to_entity(cursor.fetchone(), mapper)

    def get_all(self, mapper = 'country'):
        cursor = self._db_context.get_cursor()

        cursor.execute("SELECT * FROM country")
        return self._map_to_entity_collection(cursor.fetchall(), mapper)