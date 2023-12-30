from graphene import List, String

from schema.mutations.country.inputs.create_region_input import CreateRegionInput
from schema.validation_input import BaseValidationInput


class CreateCountryInput(BaseValidationInput):
    id = String(required=False)
    name = String(required=False)
    regions = List(CreateRegionInput, required=False)

    def validate_fields(self):
        if self.id:
            self.validate_uuid(self.id)

            if not self.regions:
                raise Exception('Please do not provide an id, only when adding a new region')
            
            if self.name:
                raise Exception('Please do not provide an id, only when adding a new region')
            
            return True

        self.validate_text(self.name, 100)

        return True