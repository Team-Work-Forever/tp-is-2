from data import DbConnection
from functions import Handler

class GetAveragePointsPerWineHandler(Handler):
    def __init__(self) -> None:
        self.db_access = DbConnection()

    def get_name(self):
        return "get_average_points_per_wine"

    def handle(self, limit: str, order = 'desc'):
        result = []
        cursor = self.db_access.get_cursor()

        try:
            query = f"""
                with wines as (
                    select
                        unnest(xpath('/WineReviews/Wines/Wine/@winery', xml))::text as name,
                        unnest(xpath('/WineReviews/Wines/Wine/@id', xml))::text as id
                    from active_imported_documents
                ), reviews as (
                    select
                        unnest(xpath('/WineReviews/Reviews/Review/@points', xml))::text::float as avg_points,
                        unnest(xpath('/WineReviews/Reviews/Review/@wine_id', xml))::text as wine_id
                        from active_imported_documents
                )
                select
                    wines.name as winery,
                avg(reviews.avg_points) as avg_points
                from wines, reviews
                where wines.id = reviews.wine_id
                group by winery
                order by avg_points {order}
                limit {limit}
                ;
            """

            cursor.execute(query)

            result = cursor.fetchall()
        
        except Exception as e:
            print(e)
            return self.send_error("Some error occurred while quering the requested data")

        return result