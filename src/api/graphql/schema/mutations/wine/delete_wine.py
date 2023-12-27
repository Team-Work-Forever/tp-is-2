from graphene import Mutation, String

from schema.types.wine_type import WineType
from schema import wine_repo

class DeleteWine(Mutation):
    class Arguments:
        wineId = String(required=True)

    Output = WineType

    def mutate(root, info, wineId: str = None):
        if wineId is None:
            raise Exception("Please provide a wineId")
        
        # try to get the wine
        wine = wine_repo.get_by_id(wineId)

        if wine is None:
            raise Exception("wine not found")
        
        # verify if any review is associated with this wine
        if wine_repo.wine_has_any_reviews_associated(wineId):
            raise Exception("wine has reviews associated with it")
        
        # Delete wine
        return wine_repo.delete(wineId)
        
