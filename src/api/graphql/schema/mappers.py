def map_to_region(row):
    return {
        'id': row[0],
        'name': row[1],
        'province': row[2],
        'createdAt': row[3],
        'updatedAt': row[4],
        'deletedAt': row[5]
    }

def map_to_country(row):
    return {
        'id': row[0],
        'name': row[1],
        'createdAt': row[2],
        'updatedAt': row[3],
        'deletedAt': row[4]
    }


def map_to_taster(row):
    return {
        'id': row[0],
        'name': row[1],
        'twitter_handle': row[2],
        'createdAt': row[3],
        'updatedAt': row[4],
        'deletedAt': row[5]
    }

def map_to_review(row):
    return {
        'id': row[0],
        'description': row[1],
        'points': row[2],
        'twitter_handle': row[3],
        'wine_title': row[4],
        'createdAt': row[5],
        'updatedAt': row[6],
        'deletedAt': row[7]
    }


def map_to_wine(row):
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