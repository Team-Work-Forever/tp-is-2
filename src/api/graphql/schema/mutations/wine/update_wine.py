
from graphene import Mutation
from schema.mutations.wine.inputs.update_wine_input import UpdateWineInput

from schema.types.wine_type import WineType
from schema import wine_repo

class UpdateWine(Mutation):
    class Arguments:
        input = UpdateWineInput(required=True)

    Output = WineType

    def mutate(root, info, input: UpdateWineInput = None):
        if input is None:
            raise Exception("Please provide a valid input")
        
        # get wine
        wine = wine_repo.get_by_id(input.id)

        if wine is None:
            raise Exception("Wine not found")
        
        # Update wine
        return wine_repo.update(
            wine_id=input.id,
            price=input.price,
            designation=input.designation,
            variety=input.variety,
            title=input.title,
            winery=input.winery
        )
        
