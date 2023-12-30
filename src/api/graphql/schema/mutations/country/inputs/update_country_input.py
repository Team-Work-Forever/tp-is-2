from graphene import InputObjectType

from schema.mutations.inputs.text_input import Text
from schema.mutations.inputs.uuid_input import UUID


class UpdateCountryInput(InputObjectType):
    id = UUID(required=True)
    name = Text(required=True, min=3)