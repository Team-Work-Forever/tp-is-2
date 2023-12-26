from graphene import Float, ObjectType, String, DateTime


class ReviewType(ObjectType):
    id = String()
    points = Float()
    description = String()
    twitter_handle = String()
    wine_title = String()
    createdAt = DateTime()
    updatedAt = DateTime()
    deletedAt = DateTime()
