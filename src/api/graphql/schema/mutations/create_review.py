from graphene import Mutation, String
from data.repositories.taster_repository import TasterRepository
from data.repositories.wine_repository import WineRepository
from schema.mutations.inputs.create_review_input import CreateReviewInput
from schema.types.review import ReviewType

def __map_to_review(row):
    return {
        'id': row[0],
        'description': row[1],
        'points': row[2],
        'twitter_handle': row[7],
        'wine_title': row[6],
        'createdAt': row[3],
        'updatedAt': row[4],
        'deletedAt': row[5]
    } 

wine_repository = WineRepository({
    'review': __map_to_review
})

def __map_to_taster(row):
    if row is None:
        return None

    return {
        'id': row[0],
        'name': row[1],
        'twitter_handle': row[2],
        'createdAt': row[3],
        'updatedAt': row[4],
        'deletedAt': row[5]
    }

taster_repository = TasterRepository({
    'taster': __map_to_taster
})


class CreateReview(Mutation):
    class Arguments:
        wineId = String(required=True)
        input = CreateReviewInput(required=True)

    Output = ReviewType

    def mutate(root, info, wineId: str, input: CreateReviewInput = None):
        if input is None:
            return None
        
        taster = taster_repository.get_by_twitter_handle(input.twitterHandle)

        if taster is None:
            return None
        
        return wine_repository.create_review(wineId, input.points, input.description, taster['id'])