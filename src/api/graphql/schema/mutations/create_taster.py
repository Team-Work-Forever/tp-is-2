from graphene import Mutation
from data.repositories.taster_repository import TasterRepository
from schema.mutations.inputs.create_taster_input import CreateTasterInput
from schema.types.taster import TasterType


def __map_to_taster(row):
    return {
        'id': row[0],
        'name': row[1],
        'twitter_handle': row[2],
        'createdAt': row[3],
        'updatedAt': row[4],
        'deletedAt': row[5]
    }

taster_repository = TasterRepository({
    'taster': __map_to_taster
})

class CreateTaster(Mutation):
    class Arguments:
        input = CreateTasterInput(required=True)

    Output = TasterType

    def mutate(root, info, input: CreateTasterInput = None):
        if input is None:
            return None
        
        return taster_repository.create(input.name, input.twitter_handle)
        
