import uuid
from graphene import Scalar


class UUID(Scalar):
    __message = "Invalid input type. UUID must be provided as a string."

    @staticmethod
    def serialize(value):
        return str(value)

    @staticmethod
    def parse_literal(node):
        try:
            if isinstance(node.value, str) and UUID.__validate_uuid(node.value):
                return node.value
            
            raise ValueError(UUID.__message)
        except ValueError:
            raise ValueError(UUID.__message)

    @staticmethod
    def parse_value(value):
        try:
            if isinstance(value, str) and UUID.__validate_uuid(value):
                return value
            
            raise ValueError(UUID.__message)
        except:
            raise ValueError(UUID.__message)

    @staticmethod
    def __validate_uuid(value: str) -> bool:
        return str(uuid.UUID(value, version=5)) == value
