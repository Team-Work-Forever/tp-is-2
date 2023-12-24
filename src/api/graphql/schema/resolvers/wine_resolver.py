from data.repositories.wine_repository import WineRepository

def __map_to_wine(row):
    return {
        'id': row[0],
        'price': row[1],
        'designation': row[2],
        'variety': row[3],
        'winery': row[4],
        'title': row[5],
        'region' : row[9],
        'createdAt': row[6],
        'updatedAt': row[7],
        'deletedAt': row[8]
    }
    
wine_repository = WineRepository({
    'wine': __map_to_wine
})

def resolve_wines(query, info):
    return wine_repository.get_all()