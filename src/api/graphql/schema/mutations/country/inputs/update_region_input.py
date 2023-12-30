from graphene import InputObjectType
from schema.mutations.inputs.text_input import Text

from schema.mutations.inputs.uuid_input import UUID


class UpdateRegionInput(InputObjectType):
    id = UUID(required=True)
    name = Text(required=False, min=3)
    province = Text(required=False, min=3)