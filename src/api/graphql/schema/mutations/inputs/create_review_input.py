from graphene import InputObjectType, String, Int


class CreateReviewInput(InputObjectType):
    points = Int(required=True)
    description = String(required=True)
    twitterHandle = String(required=True)