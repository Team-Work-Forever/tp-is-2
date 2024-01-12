import time

import httpx
from helpers import Env
from services.api import Api

class GisApi(Api):
    def __init__(self) -> None:
        self.waiting_time = int(Env.get_var("UPDATER_GIS_GIS_WAIT_FOR_API"))
        super().__init__(Env.get_var("UPDATER_GIS_API_GIS_URL"))

    async def publish_coordinates(self, region: str, lat: float, lon: float):
        try:
            request_body = {
                "lat": lat,
                "lon": lon
            }

            await self._make_request("PATCH", f"api/entity/{region}", json=request_body)
            time.sleep(self.waiting_time)
        except Exception as e:
            print(f"Cound't Patch entity: {e}")