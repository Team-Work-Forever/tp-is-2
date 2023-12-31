import psycopg2
from functions import Handler
from data import DbConnection

class GetNumberReviewsToVinery(Handler):

    def __init__(self) -> None:
        self.dbAccess = DbConnection()

    def get_name(self):
        return "get_number_reviews_winery"

    def handle(self, file_name: str = '', limit = 10):
        result = ''
        cursor = self.dbAccess.get_cursor()

        get_reviews = f"""
            with reviews as (
                select
                    unnest(xpath('/WineReviews/Reviews/Review/@id', xml))::text as review_id,
	                unnest(xpath('/WineReviews/Reviews/Review/@wine_id', xml))::text as review_wine_id
                from active_imported_documents
                where file_name = %s
            ), wines as (
 	            select
                    unnest(xpath('/WineReviews/Wines/Wine/@id', xml))::text as wine_id,
                    unnest(xpath('/WineReviews/Wines/Wine/@winery', xml))::text as winery
                from active_imported_documents
                where file_name = %s
            )
            select
            w.winery as wine,
            count(r.review_id) as qty_reviews
            from wines w, reviews r
            where r.review_wine_id = w.wine_id
            group by wine
            order by qty_reviews desc
            limit {limit};
        """

        try:
            cursor.execute(get_reviews, (file_name, file_name))
            result = cursor.fetchall()

        except psycopg2.errors.UniqueViolation as e:
            print(e)
            return self.send_error("Some error has ocorred get the required information")

        return result