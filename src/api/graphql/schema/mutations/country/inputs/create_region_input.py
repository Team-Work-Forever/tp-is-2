from graphene import InputObjectType

from schema.mutations.inputs.text_input import Text


class CreateRegionInput(InputObjectType):
    name = Text(required=True)
    province = Text(required=True)