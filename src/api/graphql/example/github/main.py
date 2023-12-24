from flask import Flask
from flask_graphql import GraphQLView
from graphene import ObjectType, String, Schema

app = Flask(__name__)

class Query(ObjectType):
    hello = String(description="Simple GraphQL example", default_value="Hello world!")

schema = Schema(query=Query)

app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True),
)