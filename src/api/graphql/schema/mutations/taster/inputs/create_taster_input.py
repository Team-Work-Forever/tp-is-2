from graphene import InputObjectType, String

from schema.mutations.inputs.text_input import Text
from schema.mutations.inputs.twitter_handle_input import TwitterHandle
from schema.mutations.inputs.validation_input import BaseValidationInput


class CreateTasterInput(BaseValidationInput):
    name = Text(required=True, min=3)
    twitter_handle = TwitterHandle(required=True)