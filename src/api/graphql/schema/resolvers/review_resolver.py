from data.repositories.wine_repository import WineRepository

def __map_to_review(row):
    return {
        'id': row[0],
        'description': row[1],
        'points': row[2],
        'twitter_handle': row[3],
        'wine_title': row[4],
        'createdAt': row[5],
        'updatedAt': row[6],
        'deletedAt': row[7]
    }

wine_repository = WineRepository({
    'review': __map_to_review
})

def resolve_reviews(wine, info):
    return wine_repository.get_review_by_wine_id(wine['id'])