from schema import taster_repo

def resolve_tasters(query, info):
    return taster_repo.get_all()