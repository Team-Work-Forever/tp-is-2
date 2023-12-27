from graphene import Mutation
from schema.mutations.taster.inputs.update_taster_input import UpdateTasterInput
from schema.types.taster_type import TasterType

from schema import taster_repo


class UpdateTaster(Mutation):
    class Arguments:
        input = UpdateTasterInput(required=True)

    Output = TasterType

    def mutate(root, info, input: UpdateTasterInput = None):
        if input is None:
            raise Exception('Please provide an input')
        
        # get taster
        taster = taster_repo.get_by_id(input.id)

        if taster is None:
            raise Exception('Taster not found')
        
        # update taster
        return taster_repo.update(input.id, input.name)
        