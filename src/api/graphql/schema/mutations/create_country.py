from graphene import Mutation

from data.repositories.country_repository import CountryRepository
from schema.mutations.inputs.create_country_input import CreateCountryInput
from schema.types.country import CountryType

def _map_to_country(row):
    return {
        'id': row[0],
        'name': row[1],
        'createdAt': row[2],
        'updatedAt': row[3],
        'deletedAt': row[4]
    }

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
    'country': _map_to_country,
    'region': _map_to_region
})

class CreateCountry(Mutation):
    class Arguments:
        input = CreateCountryInput(required=True)

    Output = CountryType

    def mutate(root, info, input: CreateCountryInput = None):
        if input is None:
            return None
        
        country = country_repository.create(input.name)

        if input.regions is not None:
            country['regions'] = country_repository.create_many_regions(input.regions, country['id'])

        return country
        
