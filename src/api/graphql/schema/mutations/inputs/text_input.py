from graphene import Scalar, String


class Text(Scalar):
    __must_be_str = "Invalid input type. Text must be provided as a string."
    __must_not_be_empty = "Please provide a text"
    __must_not_be_digit = "Please provide a valid text"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    @staticmethod
    def serialize(value):
        return str(value)

    @staticmethod
    def parse_literal(node):
        try:
            if not isinstance(node.value, str):
                raise ValueError(Text.__must_be_str)
            
            Text.validate_text(node.value, length=4)

            return node.value
        except ValueError as e:
            raise ValueError(str(e))

    @staticmethod
    def parse_value(value):
        return Text.parse_literal(value)

    @staticmethod
    def validate_text(value, length: int = None):
        if not value:
            raise ValueError(Text.__must_not_be_empty)
        
        if value.isdigit():
            raise ValueError(Text.__must_not_be_digit)
        
        if length is not None:
            if len(value) <= length:
                raise ValueError(f'Please provide a text with a minimum of {length} characters')
        
        return True