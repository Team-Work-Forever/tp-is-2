from data import DbConnection
from functions import Handler

class GetNumberOfReviewsMadeByAnTaster(Handler):
    def __init__(self) -> None:
        self.db_access = DbConnection()

    def get_name(self):
        return "get_number_of_reviews_made_by_an_taster"

    def handle(self):
        result = []
        cursor = self.db_access.get_cursor()

        try:
            query = f"""
                with tasters as (
                    select
                        unnest(xpath('/WineReviews/Tasters/Taster/@name', xml))::text as name,
                        unnest(xpath('/WineReviews/Tasters/Taster/@id', xml))::text as id
                    from active_imported_documents
                ), reviews as (
                    select
                        unnest(xpath('/WineReviews/Reviews/Review/@id', xml))::text as id,
                        unnest(xpath('/WineReviews/Reviews/Review/@taster_id', xml))::text as taster_id
                        from active_imported_documents
                )
                select
                    tasters.name as taster,
                count(reviews.id) as qty_reviews
                from tasters, reviews
                where tasters.id = reviews.taster_id
                group by taster
                ;
            """

            cursor.execute(query)

            result = cursor.fetchall()
        
        except Exception as e:
            print(e)
            return self.send_error("Some error occurred while quering the requested data")

        return result