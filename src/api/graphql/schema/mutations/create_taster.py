from graphene import Mutation
from schema.mutations.inputs.create_taster_input import CreateTasterInput
from schema.types.taster_type import TasterType
from schema import taster_repo

class CreateTaster(Mutation):
    class Arguments:
        input = CreateTasterInput(required=True)

    Output = TasterType

    def mutate(root, info, input: CreateTasterInput = None):
        if input is None:
            return None
        
        return taster_repo.create(input.name, input.twitter_handle)
        
