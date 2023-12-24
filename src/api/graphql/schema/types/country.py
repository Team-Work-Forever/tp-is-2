from graphene import Field, List, ObjectType, String, DateTime
from schema.resolvers.region_resolver import resolve_regions
from schema.types.regions import RegionType

class CountryType(ObjectType):
    id = String()
    name = String()
    regions = Field(List(RegionType), resolver=resolve_regions)
    createdAt = DateTime()
    updatedAt = DateTime()
    deletedAt = DateTime()

    def __init__(self, id, name, createdAt, updatedAt, deletedAt=None):
        self.id = id
        self.name = name
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.deletedAt = deletedAt

    def add_regions(self, regions):
        self.regions = regions
