from graphene import Mutation, String

from schema.types.country_type import CountryType
from schema import country_repo

class DeleteCountry(Mutation):
    class Arguments:
        countryId = String(required=True)

    Output = CountryType

    def mutate(root, info, countryId: str = None):
        if input is None:
            return None
        
        # Verify if the country exists
        country: CountryType = country_repo.get_by_id(countryId)

        # Can't delete a country that doesn't exist
        if country is None:
            return None

        # Verify if the country has regions
        if country_repo.check_if_country_has_regions(countryId):
            return None
        
        country = country_repo.delete(countryId)
        return country