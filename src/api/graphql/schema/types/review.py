from graphene import ObjectType, String, Float, DateTime


class ReviewType(ObjectType):
    id = String()
    points = Float()
    description = String()
    twitter_handle = String()
    wine_title = String()
    createdAt = DateTime()
    updatedAt = DateTime()
    deletedAt = DateTime()

    def __init__(self, id, points, description, twitter_handle, wine_title, createdAt, updatedAt, deletedAt=None):
        self.id = id
        self.points = points
        self.description = description
        self.twitter_handle = twitter_handle
        self.wine_title = wine_title
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.deletedAt = deletedAt