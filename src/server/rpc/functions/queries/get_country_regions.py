from data import DbConnection
from functions import Handler

class GetCountryRegions(Handler):
    def __init__(self) -> None:
        self.db_access = DbConnection()

    def get_name(self):
        return "get_country_region"

    def handle(self, country: str):
        result = []
        cursor = self.db_access.get_cursor()

        try:
            query = f"""
                select
                    distinct
                    unnest(xpath('/WineReviews/Countries/Country[@name="{country}"]/Region/@region', xml))::text as Regions
                from public.active_imported_documents;
            """

            cursor.execute(query)

            result = cursor.fetchall()
        
        except Exception as e:
            print(e)
            return self.send_error("Some error occurred while quering the requested data")

        return [value[0] for value in result]