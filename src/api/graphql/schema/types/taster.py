from graphene import DateTime, ObjectType, String


class TasterType(ObjectType):
    id = String()
    name = String()
    twitter_handle = String()
    createdAt = DateTime()
    updatedAt = DateTime()
    deletedAt = DateTime()

    def __init__(self, id, name, twitter_handle, createdAt, updatedAt, deletedAt=None):
        self.id = id
        self.name = name
        self.twitter_handle = twitter_handle
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.deletedAt = deletedAt