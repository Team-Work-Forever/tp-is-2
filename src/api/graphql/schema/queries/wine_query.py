from schema import wine_repo

def resolve_wines(query, info):
    return wine_repo.get_all()

def resolve_reviews(wine, info):
    return wine_repo.get_review_by_wine_id(wine['id'])