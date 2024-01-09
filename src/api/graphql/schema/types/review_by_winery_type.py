from graphene import ObjectType, String, Float

class ReviewByWineryType(ObjectType):
    winery = String()
    number_of_reviews = Float()