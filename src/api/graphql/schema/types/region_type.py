from graphene import ObjectType, String, DateTime

class RegionType(ObjectType):
    id = String()
    name = String()
    province = String()
    createdAt = DateTime()
    updatedAt = DateTime()
    deletedAt = DateTime()