from graphene import Mutation
from data.repositories.country_repository import CountryRepository

from data.repositories.wine_repository import WineRepository
from schema.mutations.inputs.create_taster_input import CreateTasterInput
from schema.mutations.inputs.create_wine_input import CreateWineInput
from schema.types.regions import RegionType
from schema.types.wine import WineType


def _map_to_region(row):
    return {
        'id': row[0],
        'name': row[1],
        'province': row[2],
        'createdAt': row[3],
        'updatedAt': row[4],
        'deletedAt': row[5]
    }

country_repository = CountryRepository({
    'region': _map_to_region
})


def __map_to_wine(row):
    return {
        'id': row[0],
        'price': row[1],
        'designation': row[2],
        'variety': row[3],
        'winery': row[4],
        'title': row[5],
        'region' : row[9],
        'createdAt': row[6],
        'updatedAt': row[7],
        'deletedAt': row[8]
    }
    
wine_repository = WineRepository({
    'wine': __map_to_wine
})

class CreateWine(Mutation):
    class Arguments:
        input = CreateWineInput(required=True)

    Output = WineType

    def mutate(root, info, input: CreateWineInput = None):
        if input is None:
            return None
        
        region: RegionType = country_repository.get_region_by_name(input.region)

        if region is None:
            return None
        
        return wine_repository.create(
            input.price,
            input.designation,
            input.variety,
            input.title,
            input.winery,
            region['id'],
            region['name']
        )
        
