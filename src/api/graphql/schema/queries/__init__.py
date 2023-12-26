from graphene import ObjectType, Field, List

from schema.queries.country_query import resolve_countries
from schema.queries.taster_query import resolve_tasters
from schema.queries.wine_query import resolve_wines

from schema.types.country_type import CountryType
from schema.types.taster_type import TasterType
from schema.types.wine_type import WineType

class Query(ObjectType):
    countries = Field(List(CountryType), resolver=resolve_countries)
    wines = Field(List(WineType), resolver=resolve_wines)
    tasters = Field(List(TasterType), resolver=resolve_tasters)