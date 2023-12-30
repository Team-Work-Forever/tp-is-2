from graphene import List

from schema.mutations.country.inputs.create_region_input import CreateRegionInput
from schema.mutations.inputs.text_input import Text
from schema.mutations.inputs.uuid_input import UUID
from schema.mutations.inputs.validation_input import BaseValidationInput


class CreateCountryInput(BaseValidationInput):
    id = UUID(required=False)
    name = Text(required=False, min=3)
    regions = List(CreateRegionInput, required=False)

    def validate_fields(self) -> bool:
        if self.id and self.name:
            raise Exception('Please provide either an id or a name, not both')

        if not self.id and self.regions and len(self.regions) > 0:
            raise Exception('Please provide an id when creating regions')

        return True