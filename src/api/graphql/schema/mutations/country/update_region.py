from graphene import Mutation
from schema.mutations.country.inputs.update_region_input import UpdateRegionInput

from schema.types.region_type import RegionType
from schema import country_repo


class UpdateRegion(Mutation):
    class Arguments:
        input = UpdateRegionInput(required=True)

    Output = RegionType

    def mutate(root, info, input: UpdateRegionInput = None):
        if not input:
            raise Exception('Region ID is required')
        
        if input.name is None and input.province is None:
            raise Exception('Name or province is required')

        # Can't delete a country that doesn't exist
        region = country_repo.get_region_by_id(input.id)

        if region is None:
            raise Exception('Region not found')

        # Is region being used on a wine?
        region = country_repo.update_region(input.id, input.name, input.province)
        return region