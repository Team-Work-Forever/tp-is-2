from graphene import Float, ObjectType, String, DateTime, Field, List
from schema.queries.wine_query import resolve_reviews

from schema.types.review_type import ReviewType

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
