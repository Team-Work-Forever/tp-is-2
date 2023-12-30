from graphene import InputObjectType, String, Float


class UpdateWineInput(InputObjectType):
    id = String(required=True)
    price = Float(required=False)
    designation = String(required=False)
    variety = String(required=False)
    title = String(required=False)
    winery = String(required=False)