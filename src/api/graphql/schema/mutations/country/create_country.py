from graphene import Mutation

from schema.mutations.country.inputs.create_country_input import CreateCountryInput
from schema.types.country_type import CountryType
from schema import country_repo

class CreateCountry(Mutation):
    class Arguments:
        input = CreateCountryInput(required=True)

    Output = CountryType

    def mutate(root, info, input: CreateCountryInput = None):
        if not input:
            raise Exception('Please provide an input')
        
        # Validate input
        input.validate_fields()

        # Get or create country
        if input.id:
            country = country_repo.get_by_id(input.id)

        if input.name:
            country = country_repo.get_by_name(input.name)

            if country:
                raise Exception('Country already exists')

            country = country_repo.create(input.name)

        # Country does not exist
        if country is None:
            raise Exception('Country not found')

        if input.regions is not None:
            country['regions'], not_inserted_regions = country_repo.create_many_regions(input.regions, country['id'])

        if not_inserted_regions and len(not_inserted_regions) > 0:
            raise Exception(f"Regions that already exists, therefore not inserted {','.join(not_inserted_regions)}")

        return country
        
