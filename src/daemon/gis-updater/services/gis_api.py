import time

import httpx
from helpers import Env
from services.api import Api

class GisApi(Api):
    def __init__(self) -> None:
        super().__init__(Env.get_var("API_GIS_URL"))
        self.waiting_time = Env.get_var("GIS_WAIT_FOR_API")

    async def publish_coordinates(self, region: str, lat: float, lon: float):
        try:
            request_body = {
                "lat": lat,
                "lon": lon
            }

            await self._make_request("POST", f"/markers/{region}", json=request_body)
            time.sleep(1)
        except httpx.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
            raise
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            raise