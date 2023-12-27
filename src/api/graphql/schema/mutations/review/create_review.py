from graphene import Mutation, String
from schema.mutations.review.inputs.create_review_input import CreateReviewInput
from schema.types.review_type import ReviewType
from schema import taster_repo, wine_repo

class CreateReview(Mutation):
    class Arguments:
        wineId = String(required=True)
        input = CreateReviewInput(required=True)

    Output = ReviewType

    def mutate(root, info, wineId: str, input: CreateReviewInput = None):
        if input is None:
            raise Exception('Please provide an input')
        
        taster = taster_repo.get_by_twitter_handle(input.twitterHandle)

        if taster is None:
            raise Exception('Taster not found')
        
        return wine_repo.create_review(wineId, input.points, input.description, taster['id'])