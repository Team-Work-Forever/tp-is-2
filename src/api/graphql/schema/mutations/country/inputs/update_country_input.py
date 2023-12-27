from ast import List
from graphene import InputObjectType, String


class UpdateCountryInput(InputObjectType):
    id = String(required=True)
    name = String(required=True)