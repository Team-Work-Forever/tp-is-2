from data.repositories.base_repository import BaseRepository

class CountryRepository(BaseRepository):
    def __init__(self, map_entities):
        super().__init__()

        self._MAP_ENTITIES = map_entities

    def check_if_country_has_regions(self, country_id: str):
        cursor = self._db_context.get_cursor()

        cursor.execute(""" 
            SELECT
                region.id
            FROM region
            WHERE region.country_id = %s
            """, (country_id,)
        )

        return cursor.fetchone() is not None

    def get_by_id(self, country_id: str, mapper = 'country'):
        cursor = self._db_context.get_cursor()

        cursor.execute(""" 
            SELECT
               *
            FROM country
            WHERE country.id = %s
            """, (country_id,)
        )

        return self._map_to_entity(cursor.fetchone(), mapper)

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
    
    def update(self, country_id: str, name: str):
        cursor = self._db_context.get_cursor()

        cursor.execute(""" 
            UPDATE country
            SET name = %s
            WHERE country.id = %s
            RETURNING *
            """, (name, country_id)
        )

        self._db_context.commit()
        return self._map_to_entity(cursor.fetchone(), 'country')
    
    def delete(self, country_id: str):
        cursor = self._db_context.get_cursor()

        cursor.execute(""" 
            DELETE 
            FROM country
            WHERE country.id = %s
            RETURNING *
            """, (country_id,)
        )

        self._db_context.commit()
        return self._map_to_entity(cursor.fetchone(), 'country')
    
    def deleteRegionById(self, regionId: str):
        cursor = self._db_context.get_cursor()

        cursor.execute(""" 
            DELETE 
            FROM region
            WHERE region.id = %s
            RETURNING *
            """, (regionId,)
        )

        self._db_context.commit()
        return self._map_to_entity(cursor.fetchone(), 'region')
       
    
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
    
    def get_region_by_id(self, id: str, mapper = 'region'):
        cursor = self._db_context.get_cursor()

        cursor.execute(""" 
            SELECT
                *
            FROM region
            WHERE region.id = %s
            """, (id,)
        )

        return self._map_to_entity(cursor.fetchone(), mapper)

    def get_all(self, mapper = 'country'):
        cursor = self._db_context.get_cursor()

        cursor.execute("SELECT * FROM country")
        return self._map_to_entity_collection(cursor.fetchall(), mapper)