from graphene import ObjectType, Field, List, String, Int

from schema.queries.country_query import resolve_countries
from schema.queries.proc_queries import resolve_countries as resolve_country_name, resolve_average_points, resolve_country_regions, resolve_most_expensive_wines, resolve_country_wines, resolve_number_review_by_taster, resolve_number_reviews_winery
from schema.queries.taster_query import resolve_tasters
from schema.queries.wine_query import resolve_wines

from schema.types.most_expensive_type import MostExpensiveType
from schema.types.review_by_winery_type import ReviewByWineryType
from schema.types.review_by_taster_type import ReviewByTasterType
from schema.types.average_points_type import AveragePointsPerWineType
from schema.types.country_type import CountryType
from schema.types.country_wines_type import CountryWineType
from schema.types.taster_type import TasterType
from schema.types.wine_type import WineType

class Query(ObjectType):
    countries = Field(List(CountryType), resolver=resolve_countries)
    wines = Field(List(WineType), resolver=resolve_wines)
    tasters = Field(List(TasterType), resolver=resolve_tasters)

    # proc
    average_points = Field(List(AveragePointsPerWineType), resolver=resolve_average_points, limit=Int(), order=String())
    country_names = List(String, resolver=resolve_country_name)
    country_regions = List(String, resolver=resolve_country_regions)
    country_wines = Field(List(CountryWineType), resolver=resolve_country_wines)
    number_review_by_taster = Field(List(ReviewByTasterType), resolver=resolve_number_review_by_taster)
    number_reviews_winery = Field(List(ReviewByWineryType), resolver=resolve_number_reviews_winery)
    most_expensive_wines = Field(List(MostExpensiveType), resolver=resolve_most_expensive_wines)