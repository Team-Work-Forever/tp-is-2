import httpx
import time

from services.api import Api
from helpers import Env

class NominatimApi(Api):
    def __init__(self):
        super().__init__("https://nominatim.openstreetmap.org")
        self.waiting_time = int(Env.get_var("NOMINATIM_WAIT_FOR_API"))

    async def get_value(self, country: str, region: str) -> (float, float):
        try:
            print(f"Getting coordinates for {country} - {region}")
            response = await self._make_request("GET", f"/search?country={country}&city={region}&format=json")

            time.sleep(self.waiting_time)
            return float(response[0]['lat']), float(response[0]['lon'])
        except Exception as e:
            return 0, 0