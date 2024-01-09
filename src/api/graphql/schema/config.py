from data.repositories.country_repository import CountryRepository
from data.repositories.proc_repository import ProcRepository
from data.repositories.taster_repository import TasterRepository
from data.repositories.wine_repository import WineRepository
from schema.mappers import map_to_country, map_to_region, map_to_taster, map_to_wine, map_to_review, map_to_average, map_to_country_names, map_to_country_regions, map_to_number_tasters, map_to_country_wines, map_to_review_winery, map_to_most_expensive_wines

def init():
    country = _init_country_repository()
    taster = _init_taster_repository()
    wine = _init_wine_repository()
    proc = _init_proc_repository()
    
    return country, taster, wine, proc

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

def _init_proc_repository():
    return ProcRepository({
        'average': map_to_average,
        'countries': map_to_country_names,
        'regions': map_to_country_regions,
        'review_taster': map_to_number_tasters,
        'country_wine': map_to_country_wines,
        'review_winery': map_to_review_winery,
        'most_expensive': map_to_most_expensive_wines,
    })