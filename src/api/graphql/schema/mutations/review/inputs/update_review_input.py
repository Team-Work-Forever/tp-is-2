from graphene import InputObjectType, Int

from schema.mutations.inputs.text_input import Text


class UpdateReviewInput(InputObjectType):
    points = Int(required=False)
    description = Text(required=False, max=255)