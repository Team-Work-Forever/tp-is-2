import uuid

from abc import abstractmethod
from graphene import InputObjectType


class BaseValidationInput(InputObjectType):
    @abstractmethod
    def validate_fields(self, **kwargs) -> bool:
        pass