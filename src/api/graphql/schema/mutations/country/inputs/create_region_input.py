from graphene import InputObjectType, String


class CreateRegionInput(InputObjectType):
    name = String(required=True)
    province = String(required=True)

    def validate_fields(self):
        if not self.name:
            raise Exception('Please provide a name')

        if not self.province:
            raise Exception('Please provide a province')

        return True