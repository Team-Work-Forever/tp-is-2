from flask import Flask
from errors.internal_error import HttpError
from routes.error_handler import handle_all_exceptions
from .markers import markers

app = Flask(__name__)
app.json.sort_keys = False

app.errorhandler(HttpError)(handle_all_exceptions)
app.register_blueprint(markers)
