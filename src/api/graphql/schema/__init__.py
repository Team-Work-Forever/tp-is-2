from graphene import Schema

from .config import init
country_repo, taster_repo, wine_repo = init()

from schema.queries import Query
from schema.mutations import Mutation

schema = Schema(query=Query, mutation=Mutation)