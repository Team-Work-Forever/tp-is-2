from graphene import ObjectType, String, Float

class ReviewByTasterType(ObjectType):
    taster = String()
    number_of_reviews = Float()