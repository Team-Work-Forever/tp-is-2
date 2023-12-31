import xmlrpc
from abc import ABC, abstractmethod

class Handler(ABC):
    def __init__(self) -> None:
        pass

    @abstractmethod
    def get_name(self):
        pass

    def handle(**kargs):
        pass

    def send_error(self, message: str):
        raise xmlrpc.client.Fault(1, message)