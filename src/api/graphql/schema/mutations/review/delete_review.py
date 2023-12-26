from graphene import Mutation, String

from schema.types.review_type import ReviewType
from schema import wine_repo

class DeleteReview(Mutation):
    class Arguments:
        reviewId = String(required=True)

    Output = ReviewType

    def mutate(root, info, reviewId: str = None):
        if not reviewId:
            return None
        
        # Get Review
        review = wine_repo.get_review_by_id(reviewId)

        if not review:
            raise Exception('Review not found')
        
        # Delete Review
        return wine_repo.delete_review(reviewId)