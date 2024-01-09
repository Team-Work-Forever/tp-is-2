from schema import proc_repo

def resolve_countries(root, info):
    return proc_repo.fetch_countries()

def resolve_average_points(root, info):
    return proc_repo.fetch_average_points_per_wine()

def resolve_country_regions(root, info):
    return proc_repo.fetch_country_regions()

def resolve_country_wines(root, info):
    return proc_repo.fetch_country_wines()

def resolve_number_review_by_taster(root, info):
    return proc_repo.fetch_number_of_reviews_made_by_an_taster()

def resolve_number_reviews_winery(root, info):
    return proc_repo.fetch_number_reviews_winery()

def resolve_most_expensive_wines(root, info):
    return proc_repo.fetch_the_most_expensive_wines()