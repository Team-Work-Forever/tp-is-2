
from graphene import ObjectType

from schema.mutations.create_country import CreateCountry
from schema.mutations.create_review import CreateReview
from schema.mutations.create_taster import CreateTaster
from schema.mutations.create_wine import CreateWine


class Mutation(ObjectType):
    create_country = CreateCountry.Field()
    create_taster = CreateTaster.Field()
    create_wine = CreateWine.Field()
    create_review = CreateReview.Field()

__all__ = [
    'Mutation'
]