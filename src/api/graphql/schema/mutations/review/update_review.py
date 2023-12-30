from graphene import Mutation
from schema.mutations.inputs.uuid_input import UUID
from schema.mutations.review.inputs.update_review_input import UpdateReviewInput

from schema.types.review_type import ReviewType
from schema import wine_repo

class UpdateReview(Mutation):
    class Arguments:
        reviewId = UUID(required=True)
        input = UpdateReviewInput(required=True)

    Output = ReviewType

    def mutate(root, info, reviewId: str = None, input: UpdateReviewInput = None):
        if not reviewId:
            raise Exception('Please provide a reviewId')
        
        if not input:
            raise Exception('Please provide a valid input')
        
        # Get Review
        review = wine_repo.get_review_by_id(reviewId)

        if not review:
            raise Exception('Review not found')
        
        # Delete Review
        return wine_repo.update_review(
            review_id=reviewId,
            points=input.points,
            description=input.description
        )