from graphene import InputObjectType, List, String

from schema.mutations.country.inputs.create_region_input import CreateRegionInput


class CreateCountryInput(InputObjectType):
    name = String(required=True)
    regions = List(CreateRegionInput, required=False)