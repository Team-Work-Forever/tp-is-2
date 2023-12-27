
from graphene import ObjectType

from schema.mutations.country.create_country import CreateCountry
from schema.mutations.country.delete_country import DeleteCountry
from schema.mutations.country.delete_region import DeleteRegion
from schema.mutations.country.update_country import UpdateCountry
from schema.mutations.country.update_region import UpdateRegion
from schema.mutations.review.create_review import CreateReview
from schema.mutations.review.delete_review import DeleteReview
from schema.mutations.taster.create_taster import CreateTaster
from schema.mutations.taster.delete_taster import DeleteTaster
from schema.mutations.taster.update_taster import UpdateTaster
from schema.mutations.wine.create_wine import CreateWine
from schema.mutations.wine.delete_wine import DeleteWine


class Mutation(ObjectType):
    create_country = CreateCountry.Field()
    delete_country = DeleteCountry.Field()
    update_country = UpdateCountry.Field()
    delete_region = DeleteRegion.Field()
    update_region = UpdateRegion.Field()

    create_taster = CreateTaster.Field()
    delete_taster = DeleteTaster.Field()
    update_taster = UpdateTaster.Field()

    create_wine = CreateWine.Field()
    delete_wine = DeleteWine.Field()
    
    create_review = CreateReview.Field()
    delete_review = DeleteReview.Field()

__all__ = [
    'Mutation'
]