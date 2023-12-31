import psycopg2
from functions import Handler
from data import DbConnection

class GetTheMostExpensiveWines(Handler):

    def __init__(self) -> None:
        self.dbAccess = DbConnection()

    def get_name(self):
        return "get_the_most_expensive_wines"

    def handle(self, file_name: str = '', limit = 10):
        result = ''
        cursor = self.dbAccess.get_cursor()

        get_reviews = f"""
            SELECT 
	            io.*
            FROM (
                SELECT
                        (unnest(xpath('/WineReviews/Wines/Wine[number(@price) > 0]/@id', xml))::text) as id,
                        (unnest(xpath('/WineReviews/Wines/Wine[number(@price) > 0]/@winery', xml))::text) as winery,
                        (unnest(xpath('/WineReviews/Wines/Wine[number(@price) > 0]/@designation', xml))::text) as designation,
                        (unnest(xpath('/WineReviews/Wines/Wine[number(@price) > 0]/@variaty', xml))::text) as variaty,
                    (unnest(xpath('/WineReviews/Wines/Wine[number(@price) > 0]/@price', xml))::text::float) as price
                FROM public.active_imported_documents
                {f"WHERE file_name = '{file_name}'" if len(file_name) > 0 else ""}
            ) AS io
            ORDER by io.price desc
            LIMIT {limit};
        """

        try:
            cursor.execute(get_reviews)
            result = cursor.fetchall()

        except psycopg2.errors.UniqueViolation as e:
            print(e)
            return self.send_error("Some error has ocorred get the required information")

        return result