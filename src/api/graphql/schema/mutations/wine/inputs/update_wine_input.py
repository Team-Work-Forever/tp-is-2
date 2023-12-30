from graphene import InputObjectType, Float
from schema.mutations.inputs.text_input import Text

from schema.mutations.inputs.uuid_input import UUID


class UpdateWineInput(InputObjectType):
    id = UUID(required=True)
    price = Float(required=False)
    designation = Text(required=False)
    variety = Text(required=False)
    title = Text(required=False)
    winery = Text(required=False)