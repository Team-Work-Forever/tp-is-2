import httpx
import time

class NominatimApi():
    BASE_URL = "https://nominatim.openstreetmap.org"
   
    async def _make_request(self, path: str):
        async with httpx.AsyncClient() as client:
            response = await client.get(self.BASE_URL + path)

        response.raise_for_status()
        return response.json()

    async def get_value(self, country: str, region: str) -> (str, str):
        try:
            response = await self._make_request(f"/search?country={country}&city={region}&format=json")

            if len(response) == 0:
                return 0, 0
            
            result = str(response[0]['lat']), str(response[0]['lon'])

            time.sleep(1)
            return result
        except httpx.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
            raise
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            raise