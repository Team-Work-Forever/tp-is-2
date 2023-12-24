from data.repositories.country_repository import CountryRepository

def _map_to_country(row):
    return {
        'id': row[0],
        'name': row[1],
        'createdAt': row[2],
        'updatedAt': row[3],
        'deletedAt': row[4]
    }

country_repository = CountryRepository({
    'country': _map_to_country
})

def resolve_countries(query, info):
    return country_repository.get_all()
