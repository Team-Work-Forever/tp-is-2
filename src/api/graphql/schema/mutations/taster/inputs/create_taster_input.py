from graphene import InputObjectType, String


class CreateTasterInput(InputObjectType):
    name = String(required=True)
    twitter_handle = String(required=True)