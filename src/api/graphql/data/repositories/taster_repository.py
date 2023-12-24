from data.repositories.base_repository import BaseRepository
from schema.types.taster import TasterType


class TasterRepository(BaseRepository):
    def __init__(self, mappers):
        super().__init__()
        
        self._MAP_ENTITIES = mappers

    def get_all(self):
        cursor = self._db_context.get_cursor()

        cursor.execute("SELECT * FROM taster")
        return self._map_to_entity_collection(cursor.fetchall(), "taster")