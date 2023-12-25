from services.db_access import DbConnection

class MarkRepository():
    def __init__(self) -> None:
        self._db_context = DbConnection()

    def check_if_region_exists(self, region_name):
        cursor = self._db_context.get_cursor()

        cursor.execute("""
            SELECT 
                id
            FROM region
            WHERE name = %s
            """,
            (region_name,)
        )

        return cursor.fetchone() is not None

    def update_gis_mark(self, region_name: str, lat: float, lon: float):
        cursor = self._db_context.get_cursor()

        # create point
        point = f"POINT({lat} {lon})"

        cursor.execute("""
            UPDATE region
            SET coordinates = ST_GeomFromText(%s, 4326)
            WHERE name = %s
            """,
            (point, region_name)
        )

        self._db_context.commit()