def map_to_region(row):
    if row is None:
        return None

    return {
        'id': row[0],
        'name': row[1],
        'province': row[2],
        'createdAt': row[3],
        'updatedAt': row[4],
        'deletedAt': row[5]
    }

def map_to_country(row):
    if row is None:
        return None

    return {
        'id': row[0],
        'name': row[1],
        'createdAt': row[2],
        'updatedAt': row[3],
        'deletedAt': row[4]
    }


def map_to_taster(row):
    if row is None:
        return None

    return {
        'id': row[0],
        'name': row[1],
        'twitter_handle': row[2],
        'createdAt': row[3],
        'updatedAt': row[4],
        'deletedAt': row[5]
    }

def map_to_review(row):
    if row is None:
        return None

    return {
        'id': row[0],
        'description': row[1],
        'points': row[2],
        'twitter_handle': row[6],
        'wine_title': row[7],
        'createdAt': row[3],
        'updatedAt': row[4],
        'deletedAt': row[5]
    }


def map_to_wine(row):
    if row is None:
        return None

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

def map_to_average(row):
    if row is None:
        return None

    return {
        'winery': row[0],
        'average_points': row[1],
    }

def map_to_country_names(row):
    if row is None:
        return None

    return row[0]

def map_to_country_regions(row):
    if row is None:
        return None

    return row[0]

def map_to_number_tasters(row):
    if row is None:
        return None

    return {
        'taster': row[0],
        'number_of_reviews': row[1],
    }

def map_to_country_wines(row):
    if row is None:
        return None

    return {
        'country': row[0],
        'number_of_wines': row[1],
    }

def map_to_review_winery(row):
    if row is None:
        return None

    return {
        'winery': row[0],
        'number_of_reviews': row[1],
    }

def map_to_most_expensive_wines(row):
    if row is None:
        return None

    return {
        'id': row[0],
        'winery': row[1],
        'designation': row[2],
        'variety': row[3],
        'price': row[4],
    }