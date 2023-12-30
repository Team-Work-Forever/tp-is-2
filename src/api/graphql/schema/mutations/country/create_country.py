from graphene import Mutation

from schema.mutations.country.inputs.create_country_input import CreateCountryInput
from schema.types.country_type import CountryType
from schema import country_repo

class CreateCountry(Mutation):
    class Arguments:
        input = CreateCountryInput(required=True)

    Output = CountryType

    def mutate(root, info, input: CreateCountryInput = None):
        if input is None:
            raise Exception('Please provide an input')
        
        if not input.validate_fields():
            raise Exception('Please provide a valid input')
        
        if input.name is not None:
            country = country_repo.create(input.name)
        else:
            country = country_repo.get_by_id(input.id)

        # Country does not exist
        if country is None:
            raise Exception('Country not found')

        if input.regions is not None:
            country['regions'] = country_repo.create_many_regions(input.regions, country['id'])

        return country
        
