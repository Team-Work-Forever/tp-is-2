from graphene import Mutation
from schema.mutations.taster.inputs.create_taster_input import CreateTasterInput
from schema.types.taster_type import TasterType
from schema import taster_repo

class CreateTaster(Mutation):
    class Arguments:
        input = CreateTasterInput(required=True)

    Output = TasterType

    def mutate(root, info, input: CreateTasterInput = None):
        if not input:
            raise Exception('Please provide an input')
        
        return taster_repo.create(input.name, input.twitter_handle)
        
