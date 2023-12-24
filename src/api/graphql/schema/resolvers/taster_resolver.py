
from data.repositories.taster_repository import TasterRepository

def __map_to_taster(row):
    return {
        'id': row[0],
        'name': row[1],
        'twitter_handle': row[2],
        'createdAt': row[3],
        'updatedAt': row[4],
        'deletedAt': row[5]
    }

taster_repository = TasterRepository({
    'taster': __map_to_taster
})

def resolve_tasters(query, info):
    return taster_repository.get_all()