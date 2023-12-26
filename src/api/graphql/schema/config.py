from data.repositories.country_repository import CountryRepository
from data.repositories.taster_repository import TasterRepository
from data.repositories.wine_repository import WineRepository
from schema.mappers import map_to_country, map_to_region, map_to_taster, map_to_wine, map_to_review

def init():
    country = _init_country_repository()
    taster = _init_taster_repository()
    wine = _init_wine_repository()
    
    return country, taster, wine

def _init_country_repository():
    return CountryRepository({
        'country': map_to_country,
        'region': map_to_region
    })

def _init_taster_repository():
    return TasterRepository({
        "taster": map_to_taster,
    })

def _init_wine_repository():
    return WineRepository({
        'wine': map_to_wine,
        'review': map_to_review
    })