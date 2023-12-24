from data import DbConnection


class BaseRepository():
    def __init__(self):
        self._db_context = DbConnection()
        self.MAP_ENTITIES = {}

    def _map_to_entity_collection(self, rows, type: str):
        return [self._map_to_entity(row, type) for row in rows]

    def _map_to_entity(self, row, type: str):
        return self._MAP_ENTITIES[type](row)