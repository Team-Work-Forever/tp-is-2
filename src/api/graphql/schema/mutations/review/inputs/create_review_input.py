from graphene import InputObjectType, Int

from schema.mutations.inputs.twitter_handle_input import TwitterHandle
from schema.mutations.inputs.text_input import Text


class CreateReviewInput(InputObjectType):
    points = Int(required=True)
    description = Text(required=True, min=10, max=255)
    twitterHandle = TwitterHandle(required=True)