from data.repositories.base_repository import BaseRepository


class ProcRepository(BaseRepository):
    def __init__(self, mappers):
        super().__init__()

        self._MAP_ENTITIES = mappers

    def fetch_average_points_per_wine(self, limit: int = 10, order: str = 'desc'):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            SELECT
                wine.winery,
                AVG(review.points) AS average_points
            FROM review
            INNER JOIN wine ON review.wine_id = wine.id
            GROUP BY wine.winery
            ORDER BY average_points
            """
        )

        return self._map_to_entity_collection(cursor.fetchall(), "average")
    
    
    def fetch_countries(self):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            SELECT
                name
            FROM country
            """
        )

        return self._map_to_entity_collection(cursor.fetchall(), "countries")
    
    def fetch_country_regions(self):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            SELECT
                region.name AS region
            FROM country
            INNER JOIN region ON country.id = region.country_id
            """
        )

        return self._map_to_entity_collection(cursor.fetchall(), "regions")
    
    def fetch_number_of_reviews_made_by_an_taster(self):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            SELECT
                t.name AS taster,
                COUNT(r.*) AS number_of_reviews
            FROM review r
            INNER JOIN taster t ON r.taster_id = t.id
            GROUP BY t.name
            """
        )

        return self._map_to_entity_collection(cursor.fetchall(), "review_taster")
    
    def fetch_country_wines(self):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            SELECT
                country.name AS country,
                count(wine.id) AS number_of_wines
            FROM country
            INNER JOIN region ON region.country_id = country.id
            INNER JOIN wine ON region.id = wine.region_id
            GROUP BY country.name
            """
        )

        return self._map_to_entity_collection(cursor.fetchall(), "country_wine")
       
    def fetch_number_reviews_winery(self, limit: int = 10, order: int = 'desc'):
        cursor = self._db_context.get_cursor()

        cursor.execute(f"""
            SELECT
                wine.winery AS winery,
                COUNT(review.*) AS number_of_reviews
            FROM review
            INNER JOIN wine ON review.wine_id = wine.id
            GROUP BY wine.winery
            ORDER BY number_of_reviews {order}
            LIMIT {limit}
            """
        )

        return self._map_to_entity_collection(cursor.fetchall(), "review_winery")
    
    def fetch_the_most_expensive_wines(self, limit: int = 10, order: int = 'desc'):
        cursor = self._db_context.get_cursor()

        cursor.execute(f"""
            SELECT
                id,
                winery,
                designation,
                variety,
                price
            FROM wine
            ORDER BY price {order}
            LIMIT {limit}
            """
        )

        return self._map_to_entity_collection(cursor.fetchall(), "most_expensive")