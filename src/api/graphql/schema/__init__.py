from graphene import Schema

from schema.query import Query
from schema.mutations import Mutation

schema = Schema(query=Query, mutation=Mutation)