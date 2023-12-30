from graphene import InputObjectType

from schema.mutations.inputs.text_input import Text


class CreateRegionInput(InputObjectType):
    name = Text(required=True, min=3)
    province = Text(required=True, min=3)