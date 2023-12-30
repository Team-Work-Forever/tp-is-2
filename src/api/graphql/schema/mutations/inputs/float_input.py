from graphene import Scalar


class Float(Scalar):
    __must_be_str = "Invalid input type. Must be an float 0.0."
    __must_not_be_empty = "Please provide a Float"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    @staticmethod
    def serialize(value):
        return float(value)

    @staticmethod
    def parse_literal(node):
        try:
            if not isinstance(node.value, str):
                raise ValueError(Float.__must_be_str)
            
            return Float.validate_float(node.value)
        except ValueError as e:
            raise ValueError(str(e))

    @staticmethod
    def parse_value(value):
        return Float.parse_literal(value)

    @staticmethod
    def validate_float(value: str):
        if not value:
            raise ValueError(Float.__must_not_be_empty)
        
        try:
            float_value = float(value)
            return float_value
        except ValueError:
            print(f"Error: '{value}' is not a valid float.")