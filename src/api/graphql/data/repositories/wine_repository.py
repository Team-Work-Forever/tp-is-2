from data.repositories.base_repository import BaseRepository

class WineRepository(BaseRepository):
    def __init__(self, map_entities):
        super().__init__()

        self._MAP_ENTITIES = map_entities

    def get_review_by_wine_id(self, wine_id):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            SELECT
                review.id,
                review.description,
                review.points,
                taster.twitter_handle,
                wine.title,
                review.created_at,
                review.updated_at,
                review.deleted_at,
                taster.name
            FROM review
            INNER JOIN taster ON review.taster_id = taster.id
            INNER JOIN wine On review.wine_id = wine.id
            WHERE review.wine_id = %s
        """, (wine_id,))

        return self._map_to_entity_collection(cursor.fetchall(), 'review')

    def get_all(self):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            SELECT
                wine.id,
                wine.price,
                wine.designation,
                wine.variety,
                wine.winery,
                wine.title,
                wine.created_at,
                wine.updated_at,
                wine.deleted_at,
                region.name
            FROM wine
            INNER JOIN region ON wine.region_id = region.id
        """)
        
        return self._map_to_entity_collection(cursor.fetchall(), 'wine')
