from graphene import ObjectType, String, Float

class CountryWineType(ObjectType):
    country = String()
    number_of_wines = Float()