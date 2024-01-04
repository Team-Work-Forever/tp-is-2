import sys

from helpers import Env

from flask import Flask
from flask_graphql import GraphQLView
from data import DbConnection

Env.load()
DbConnection()

PORT = int(sys.argv[1]) if len(sys.argv) >= 2 else 7322

app = Flask(__name__)

from schema import schema
app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True),
)

app.config["DEBUG"] = True
app.run(host="0.0.0.0", port=int(Env.get_var("API_PORT")))
