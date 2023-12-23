def toWineDto(wines: []):
    return list(map(lambda wine: {
        "id" : wine[0],
        "winery" : wine[1],
        "designation" : wine[2],
        "variaty" : wine[3],
        "price" : wine[4],
    }, wines))

def toWineFromCountryDto(wines: []):
    return list(map(lambda wine: {
        "country" : wine[0],
        "quantity_of_wines" : wine[1],
    }, wines))

def toWineryAvaragePointsDto(wines: []):
    return list(map(lambda wine: {
        "winery" : wine[0],
        "average_points" : f'{wine[1]} pts',
    }, wines))