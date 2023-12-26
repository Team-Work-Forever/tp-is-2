from data.repositories.base_repository import BaseRepository

class WineRepository(BaseRepository):
    def __init__(self, map_entities):
        super().__init__()

        self._MAP_ENTITIES = map_entities

    def is_any_wine_using_region_by_id(self, region_id: str):
        cursor = self._db_context.get_cursor()

        cursor.execute(""" 
            SELECT
                wine.id
            FROM wine
            WHERE wine.region_id = %s
            """, (region_id,)
        )

        return cursor.fetchone() is not None
    
    def is_any_review_using_taster_twitter_handle(self, twitter_handle: str):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            SELECT
                review.id
            FROM review
            INNER JOIN taster ON review.taster_id = taster.id
            WHERE taster.twitter_handle = %s
        """, (twitter_handle,))

        return cursor.fetchone() is not None
    
    def wine_has_any_reviews_associated(self, wineId: str):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            SELECT
                review.id
            FROM review
            INNER JOIN wine ON review.wine_id = wine.id
            WHERE wine.id = %s
        """, (wineId,))

        return cursor.fetchone() is not None
    
    def delete(self, wine_id: str):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            DELETE FROM wine
            WHERE wine.id = %s
            RETURNING
                id,
                price,
                designation,
                variety,
                winery,
                title,
                region_id,
                created_at,
                updated_at,
                deleted_at
        """, (wine_id,))

        wine = cursor.fetchone()
        cursor.execute("""
            SELECT
                name
            FROM region
            WHERE id = %s
        """, (wine[6],))

        wine += (cursor.fetchone()[0],)
        self._db_context.commit()
        return self._map_to_entity(wine, 'wine')

    def create(self, price, designation, variety, title, winery, region_id, region):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            INSERT INTO wine (
                price,
                designation,
                variety,
                title,
                winery,
                region_id
            ) VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING
                id,
                price,
                designation,
                variety,
                winery,
                title,
                created_at,
                updated_at,
                deleted_at
        """, (price, designation, variety, title, winery, region_id))

        wine = cursor.fetchone()
        wine = wine + (region,)

        self._db_context.commit()
        return self._map_to_entity(wine, 'wine')
    
    def create_review(self, wine_id, points, description, taster_id):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            INSERT INTO review (
                points,
                description,
                wine_id,
                taster_id
            ) VALUES (%s, %s, %s, %s)
            RETURNING
                id,
                description,
                points,
                created_at,
                updated_at,
                deleted_at
        """, (points, description, wine_id, taster_id))

        review = cursor.fetchone()

        cursor.execute("""
            SELECT
                t.twitter_handle,
                w.title
            FROM review r
            INNER JOIN taster t ON r.taster_id = t.id
            INNER JOIN wine w ON r.wine_id = w.id
            WHERE r.id = %s
        """, (review[0],))

        result = cursor.fetchone()
        review = review + result
        print(review)

        self._db_context.commit()
        return self._map_to_entity(review, 'review')

    def get_review_by_wine_id(self, wine_id):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            SELECT
                review.id,
                review.description,
                review.points,
                taster.twitter_handle,
                review.created_at,
                review.updated_at,
                review.deleted_at,
                wine.title,
                taster.name
            FROM review
            INNER JOIN taster ON review.taster_id = taster.id
            INNER JOIN wine On review.wine_id = wine.id
            WHERE review.wine_id = %s
        """, (wine_id,))

        return self._map_to_entity_collection(cursor.fetchall(), 'review')
    
    def get_by_id(self, wine_id):
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
            WHERE wine.id = %s
        """, (wine_id,))

        return self._map_to_entity(cursor.fetchone(), 'wine')

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
