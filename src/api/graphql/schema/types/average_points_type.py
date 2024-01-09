from graphene import ObjectType, String, Float

class AveragePointsPerWineType(ObjectType):
    winery = String()
    average_points = Float()