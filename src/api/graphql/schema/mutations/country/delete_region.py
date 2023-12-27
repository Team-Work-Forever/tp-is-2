from graphene import Mutation, String

from schema import country_repo, wine_repo
from schema.types.region_type import RegionType

class DeleteRegion(Mutation):
    class Arguments:
        regionId = String(required=True)

    Output = RegionType

    def mutate(root, info, regionId: str = None):
        region: RegionType = country_repo.get_region_by_id(regionId)

        # Can't delete a country that doesn't exist
        if region is None:
            raise Exception('Region not found')

        # Is region being used on a wine?
        if wine_repo.is_any_wine_using_region_by_id(regionId):
            raise Exception('Region is being used on a wine. Please delete them first')

        country = country_repo.deleteRegionById(regionId)
        return country