from graphene import InputObjectType, String


class CreateRegionInput(InputObjectType):
    name = String(required=True)
    province = String(required=True)