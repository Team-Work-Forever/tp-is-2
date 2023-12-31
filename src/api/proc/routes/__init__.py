import xmlrpc.client

from flask import Flask
from errors.internal_error import HttpError
from routes.error_handler import handle_all_exceptions, handle_rpc_exceptions, handle_value_errors, handle_internal_server_error
from routes.query import query
from routes.xml import xml

app = Flask(__name__)
app.json.sort_keys = False

app.errorhandler(HttpError)(handle_all_exceptions)
app.errorhandler(ValueError)(handle_value_errors)
app.errorhandler(xmlrpc.client.Fault)(handle_rpc_exceptions)
app.errorhandler(Exception)(handle_internal_server_error)

app.register_blueprint(query)
app.register_blueprint(xml)
