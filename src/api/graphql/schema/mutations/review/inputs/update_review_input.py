from graphene import InputObjectType, String, Int


class UpdateReviewInput(InputObjectType):
    points = Int(required=False)
    description = String(required=False)