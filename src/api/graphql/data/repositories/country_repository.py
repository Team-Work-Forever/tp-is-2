from data.repositories.base_repository import BaseRepository

class CountryRepository(BaseRepository):
    def __init__(self, map_entities):
        super().__init__()

        self._MAP_ENTITIES = map_entities

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

    def get_all(self, mapper = 'country'):
        cursor = self._db_context.get_cursor()

        cursor.execute("SELECT * FROM country")
        return self._map_to_entity_collection(cursor.fetchall(), mapper)