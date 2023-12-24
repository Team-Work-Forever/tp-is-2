from graphene import ObjectType, String, Float, DateTime, List, Field

from schema.types.review import ReviewType
from schema.resolvers.review_resolver import resolve_reviews

class WineType(ObjectType):
    id = String()
    price = Float()
    designation = String()
    variety = String()
    winery = String()
    title = String()
    region = String()
    reviews = Field(List(ReviewType), resolver=resolve_reviews)
    createdAt = DateTime()
    updatedAt = DateTime()
    deletedAt = DateTime()

    def __init__(self, id, price, designation, variety, winery, title, region, createdAt, updatedAt, deletedAt=None):
        self.id = id
        self.price = price
        self.designation = designation
        self.variety = variety
        self.winery = winery
        self.title = title
        self.region = region
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.deletedAt = deletedAt