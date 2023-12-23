def toReviewFromWineryDto(wines: []):
    return list(map(lambda wine: {
        "winery" : wine[0],
        "number_of_reviews" : wine[1],
    }, wines))