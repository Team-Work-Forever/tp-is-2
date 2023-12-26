from graphene import Mutation

from schema.mutations.wine.inputs.create_wine_input import CreateWineInput
from schema.types.region_type import RegionType
from schema.types.wine_type import WineType

from schema import country_repo, wine_repo

class CreateWine(Mutation):
    class Arguments:
        input = CreateWineInput(required=True)

    Output = WineType

    def mutate(root, info, input: CreateWineInput = None):
        if input is None:
            return None
        
        region: RegionType = country_repo.get_region_by_name(input.region)

        if region is None:
            return None
        
        return wine_repo.create(
            input.price,
            input.designation,
            input.variety,
            input.title,
            input.winery,
            region['id'],
            region['name']
        )
        
