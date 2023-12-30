from graphene import Scalar


class TwitterHandle(Scalar):
    __must_be_str = "Invalid input type. TwitterHandle must be provided as a string."
    __must_not_be_digit = "Please provide an valid twitter handle, @ must be at the start"
    __must_not_be_empty = "Please provide a twitter handle"
    __must_be_at_least_5_chars = "Please provide a twitter handle with at least 5 characters"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    @staticmethod
    def serialize(value):
        return str(value)

    @staticmethod
    def parse_literal(node):
        try:
            if not isinstance(node.value, str):
                raise ValueError(TwitterHandle.__must_be_str)
            
            TwitterHandle.validate_twitter_handle(node.value)

            return node.value
        except ValueError as e:
            raise ValueError(str(e))

    @staticmethod
    def parse_value(value):
        return TwitterHandle.parse_literal(value)

    @staticmethod
    def validate_twitter_handle(value: str):
        if not value:
            raise ValueError(TwitterHandle.__must_not_be_empty)
        
        if not value.startswith('@'):
            raise ValueError(TwitterHandle.__must_not_be_digit)
        
        if len(value) < 5:
            raise ValueError(TwitterHandle.__must_be_at_least_5_chars)
        
        return True