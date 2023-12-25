import httpx
import time

from services.api import Api
from helpers import Env

class NominatimApi(Api):
    def __init__(self):
        super().__init__("https://nominatim.openstreetmap.org")
        self.waiting_time = Env.get_var("NOMINATIM_WAIT_FOR_API")

    async def get_value(self, country: str, region: str) -> (float, float):
        try:
            response = await self._make_request("GET", f"/search?country={country}&city={region}&format=json")

            if len(response) == 0:
                return 0, 0
            
            result = float(response[0]['lat']), float(response[0]['lon'])

            time.sleep(self.waiting_time)
            return result
        except httpx.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
            raise
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            raise