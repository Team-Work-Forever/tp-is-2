from graphene import ObjectType, String, DateTime


class RegionType(ObjectType):
    id = String()
    name = String()
    province = String()
    createdAt = DateTime()
    updatedAt = DateTime()
    deletedAt = DateTime()

    def __init__(self, id, name, province, createdAt, updatedAt, deletedAt=None):
        self.id = id
        self.name = name
        self.province = province
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.deletedAt = deletedAt