from data.repositories.country_repository import CountryRepository

def _map_to_region(row):
    return {
        'id': row[0],
        'name': row[1],
        'province': row[2],
        'createdAt': row[3],
        'updatedAt': row[4],
        'deletedAt': row[5]
    }

country_repository = CountryRepository({
    'region': _map_to_region
})

def resolve_regions(country, info):
    return country_repository.get_regions_from_country(country['id'])