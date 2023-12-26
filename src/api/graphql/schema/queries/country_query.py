from schema import country_repo

def resolve_countries(root, info):
    return country_repo.get_all()

def resolve_regions(country, info):
    return country_repo.get_regions_from_country(country['id'])
