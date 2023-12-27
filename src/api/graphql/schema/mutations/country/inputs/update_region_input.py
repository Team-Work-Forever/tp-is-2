from graphene import InputObjectType, String


class UpdateRegionInput(InputObjectType):
    id = String(required=True)
    name = String(required=False)
    province = String(required=False)