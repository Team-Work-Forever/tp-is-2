from graphene import InputObjectType, List, String

from schema.mutations.country.inputs.create_region_input import CreateRegionInput


class CreateCountryInput(InputObjectType):
    id = String(required=False)
    name = String(required=False)
    regions = List(CreateRegionInput, required=False)