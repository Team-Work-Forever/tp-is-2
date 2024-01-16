from schema import proc_repo

def validate_params(limit, order):
    if limit is not None:
        limit = str(limit)

        if not limit.isdigit():
            raise Exception("limit must be a number")

        limit = int(limit)
        
        if limit < 0:
            raise Exception("limit must be greater than 0")
            
    if order is not None:
        order = order.lower()

        if order not in ['asc', 'desc']:
            raise Exception("order must be asc or desc")
        
    return limit, order

def resolve_countries(root, info):
    return proc_repo.fetch_countries()

def resolve_average_points(root, info, limit, order):
    limit, order = validate_params(limit, order)

    return proc_repo.fetch_average_points_per_wine(limit=limit, order=order)

def resolve_country_regions(root, info, country: str):
    return proc_repo.fetch_country_regions(country)

def resolve_country_wines(root, info):
    return proc_repo.fetch_country_wines()

def resolve_number_review_by_taster(root, info):
    return proc_repo.fetch_number_of_reviews_made_by_an_taster()

def resolve_number_reviews_winery(root, info, limit, order):
    limit, order = validate_params(limit, order)

    return proc_repo.fetch_number_reviews_winery(limit=limit, order=order)

def resolve_most_expensive_wines(root, info, limit, order):
    limit, order = validate_params(limit, order)

    return proc_repo.fetch_the_most_expensive_wines(limit=limit, order=order)