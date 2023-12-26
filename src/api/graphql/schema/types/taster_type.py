from graphene import ObjectType, String, DateTime

class TasterType(ObjectType):
    id = String()
    name = String()
    twitter_handle = String()
    createdAt = DateTime()
    updatedAt = DateTime()
    deletedAt = DateTime()