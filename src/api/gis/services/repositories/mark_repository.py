from services.db_access import DbConnection

class MarkRepository():
    def __init__(self) -> None:
        self._db_context = DbConnection()

    def get_selected_region(self, neLat: float = 0, neLon: float = 0, swLat: float = 0, swLon: float = 0):
        cursor = self._db_context.get_cursor()
        where_statement = ''

        if neLat != 0 and neLon != 0 and swLat != 0 and swLon != 0:
            where_statement = 'WHERE ST_Intersects(coordinates, ST_MakeEnvelope(%s, %s, %s, %s, 4326))'

        cursor.execute("""
            SELECT
                jsonb_build_object(
                    'type', 'FeatureCollection',
                    'features', jsonb_agg(
                        jsonb_build_object(
                            'type', 'Feature',
                            'id', w.id,
                            'geometry', st_asgeojson(r.coordinates)::jsonb,
                            'properties', to_jsonb(w) - 'id' - 'region_id' - 'deleted_at' || jsonb_build_object('region', r.name)
                        )
                    )
                ) AS geojson
            FROM
                region r
            INNER JOIN 
                wine w ON r.id = w.region_id
            """ + where_statement + """ and r.coordinates is not null
        """, (neLat, neLon, swLat, swLon,))

        return cursor.fetchall()

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