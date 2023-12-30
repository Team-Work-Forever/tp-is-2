import uuid

from abc import abstractmethod
from graphene import InputObjectType


class BaseValidationInput(InputObjectType):
    def get_fields(self, key: str):
        return self._meta.fields[key]
    
    def validate_text(self, value: str, len: int = None):
        if not value:
            raise Exception('Please provide a text')
        
        if value.isdigit():
            raise Exception('Please provide a valid text')
        
        if len is not None:
            if len(value) > len:
                raise Exception(f'Please provide a text with a maximum of {len} characters')
        
        return True
    
    def validate_uuid(self, value: str) -> bool:
        if not value:
            raise Exception('Please provide a uuid')

        try:
            uuid_obj = uuid.UUID(value, version=4)
            return str(uuid_obj) == value
        except ValueError:
            raise Exception('Please provide a uuid')

    @abstractmethod
    def validate_fields(self, **kwargs) -> bool:
        pass