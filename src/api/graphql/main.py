import sys

from helpers import Env

from flask import Flask
from flask_graphql import GraphQLView
from data.db_access import DbConnection

Env.load()
DbConnection()

PORT = int(sys.argv[1]) if len(sys.argv) >= 2 else 7322

app = Flask(__name__)

from schema import query_schema
app.add_url_rule(
    "/graphql",
    view_func=GraphQLView.as_view("graphql", schema=query_schema, graphiql=True),
)

app.config["DEBUG"] = True
app.run(host="0.0.0.0", port=PORT)
