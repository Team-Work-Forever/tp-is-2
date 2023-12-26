from data.repositories.base_repository import BaseRepository

class TasterRepository(BaseRepository):
    def __init__(self, mappers):
        super().__init__()
        
        self._MAP_ENTITIES = mappers

    def create(self, name: str, twitter_handle: str):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            INSERT INTO taster 
                (name, twitter_handle) VALUES (%s, %s) 
            RETURNING *;""", (name, twitter_handle))
        
        self._db_context.commit()
        return self._map_to_entity(cursor.fetchone(), "taster")
    
    def get_by_id(self, taster_id: str):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            SELECT 
                * 
            FROM taster WHERE id = %s
        """, (taster_id,))
        
        return self._map_to_entity(cursor.fetchone(), "taster")
    
    def delete(self, taster_id: str):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            DELETE 
            FROM taster 
            WHERE id = %s
            RETURNING *;
        """, (taster_id,))
        
        self._db_context.commit()
        return self._map_to_entity(cursor.fetchone(), "taster")
    
    def get_by_twitter_handle(self, twitter_handle: str):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            SELECT 
                * 
            FROM taster WHERE twitter_handle = %s
        """, (twitter_handle,))
        
        return self._map_to_entity(cursor.fetchone(), "taster")

    def get_all(self):
        cursor = self._db_context.get_cursor()

        cursor.execute("SELECT * FROM taster")
        return self._map_to_entity_collection(cursor.fetchall(), "taster")