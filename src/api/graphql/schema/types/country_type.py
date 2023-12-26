from graphene import ObjectType, String, Field, DateTime, List
from schema.queries.country_query import resolve_regions

from schema.types.region_type import RegionType


class CountryType(ObjectType):
    id = String()
    name = String()
    regions = Field(List(RegionType), resolver=resolve_regions)
    createdAt = DateTime()
    updatedAt = DateTime()
    deletedAt = DateTime()