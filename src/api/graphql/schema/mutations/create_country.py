from graphene import Mutation

from schema.mutations.inputs.create_country_input import CreateCountryInput
from schema.types.country_type import CountryType
from schema import country_repo

class CreateCountry(Mutation):
    class Arguments:
        input = CreateCountryInput(required=True)

    Output = CountryType

    def mutate(root, info, input: CreateCountryInput = None):
        if input is None:
            return None
        
        country = country_repo.create(input.name)

        if input.regions is not None:
            country['regions'] = country_repo.create_many_regions(input.regions, country['id'])

        return country
        
