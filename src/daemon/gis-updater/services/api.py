import httpx


class Api():
    def __init__(self, base_url: str) -> None:
        self.BASE_URL = base_url

    async def _make_request(self, method: str, path: str, json = None):
        async with httpx.AsyncClient() as client:
            print(f"Making request to {self.BASE_URL + path}")
            response = await client.request(method, self.BASE_URL + path, json=json)

        response.raise_for_status()
        return response.json()