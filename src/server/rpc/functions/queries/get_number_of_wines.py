from data import DbConnection
from functions import Handler

class GetNumberOfWinesByCountry(Handler):
    def __init__(self) -> None:
        self.db_access = DbConnection()

    def get_name(self):
        return "get_country_wines"

    def handle(self):
        result = []
        cursor = self.db_access.get_cursor()

        try:
            query = f"""
                with query as (
                    select
                    unnest(xpath('/WineReviews/Wines/Wine/@id', xml))::text as wine_id,
                    unnest(xpath('/WineReviews/Wines/Wine/@country_id', xml))::text as country_id
                    from active_imported_documents
                ), countries as (
                    select
                    unnest(xpath('/WineReviews/Countries/Country/@id', xml))::text as id,
                    unnest(xpath('/WineReviews/Countries/Country/@name', xml))::text as name
                from active_imported_documents
                )
                select
                    countries.name as country,
                count(query.wine_id) as number_of_wines
                from query, countries
                where query.country_id = countries.id
                group by country;
            """

            cursor.execute(query)

            result = cursor.fetchall()
        
        except Exception as e:
            print(e)
            return self.send_error("Some error occurred while quering the requested data")

        return result