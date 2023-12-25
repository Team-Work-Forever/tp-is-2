class HttpError(Exception):
    def __init__(self, message: str,  status: int) -> None:
        self.status = status
        self.message = message
        super().__init__(message)