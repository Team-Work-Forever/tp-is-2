from graphene import ObjectType, String, Float

class MostExpensiveType(ObjectType):
    id = String()
    winery = String()
    designation = String()
    variety = String()
    price = Float()