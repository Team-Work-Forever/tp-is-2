from graphene import InputObjectType, String


class UpdateTasterInput(InputObjectType):
    id = String(required=True)
    name = String(required=True)