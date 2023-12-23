from errors.http_error import HttpError
from utils import HttpStatus


class BadRequestError(HttpError):
    def __init__(self, message: str) -> None:
        super().__init__(message, HttpStatus.BAD_REQUEST)