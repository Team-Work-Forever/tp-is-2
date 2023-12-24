from graphene import ObjectType, Schema, String, Field, List

from schema.types.country import CountryType
from schema.types.taster import TasterType
from schema.types.wine import WineType

from schema.resolvers.wine_resolver import resolve_wines
from schema.resolvers.country_resolver import resolve_countries
from schema.resolvers.taster_resolver import resolve_tasters


class Query(ObjectType):
    hello = String()
    countries = Field(List(CountryType), resolver=resolve_countries)
    wines = Field(List(WineType), resolver=resolve_wines)
    tasters = Field(List(TasterType), resolver=resolve_tasters)
    
    def resolve_hello(self, info):
        return 'World'
    

schema = Schema(query=Query, types=[CountryType])