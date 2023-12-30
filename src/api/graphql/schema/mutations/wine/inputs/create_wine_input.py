from graphene import InputObjectType, Float

from schema.mutations.inputs.text_input import Text


class CreateWineInput(InputObjectType):
    price = Float(required=True)
    designation = Text(required=True, min=3, max=255)
    variety = Text(required=True, min=3)
    title = Text(required=True, min=3)
    winery = Text(required=True, min=3)
    region = Text(required=True, min=3)