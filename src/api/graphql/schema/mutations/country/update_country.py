from graphene import Mutation, String
from schema.mutations.country.inputs.update_country_input import UpdateCountryInput

from schema.types.country_type import CountryType
from schema import country_repo


class UpdateCountry(Mutation):
    class Arguments:
        input = UpdateCountryInput(required=True)

    Output = CountryType

    def mutate(root, info, input: UpdateCountryInput = None):
        if not input:
            raise Exception('Country ID is required')

        # Can't delete a country that doesn't exist
        country = country_repo.get_by_id(input.id)

        if country is None:
            raise Exception('Country not found')

        # Is region being used on a wine?
        country = country_repo.update(input.id, input.name)
        return country