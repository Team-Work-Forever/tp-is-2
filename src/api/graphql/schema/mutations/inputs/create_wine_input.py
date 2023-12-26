from graphene import InputObjectType, String, Float


class CreateWineInput(InputObjectType):
    price = Float(required=True)
    designation = String(required=True)
    variety = String(required=True)
    title = String(required=True)
    winery = String(required=True)
    region = String(required=True)