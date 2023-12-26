from graphene import Mutation, String

from schema.types.taster_type import TasterType
from schema import taster_repo, wine_repo

class DeleteTaster(Mutation):
    class Arguments:
        tasterId = String(required=True)

    Output = TasterType

    def mutate(root, info, tasterId: str = None):
        if not tasterId:
            raise Exception("tasterId is required")
        
        taster = taster_repo.get_by_id(tasterId)

        if taster is None:
            raise Exception("taster not found")
        
        # verify if any review is associated with this taster
        if wine_repo.is_any_review_using_taster_twitter_handle(taster['twitter_handle']):
            raise Exception("taster has reviews associated with it")
        
        return taster_repo.delete(tasterId)
