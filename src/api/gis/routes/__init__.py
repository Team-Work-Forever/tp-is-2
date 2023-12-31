from flask import Blueprint, Flask
from errors.internal_error import HttpError
from routes.error_handler import handle_all_exceptions, handle_value_error, handle_execution_error
from .tiles import tiles
from .entities import entities

app = Flask(__name__)
app.json.sort_keys = False

api = Blueprint('api', __name__, url_prefix="/api")

app.errorhandler(HttpError)(handle_all_exceptions)
app.errorhandler(ValueError)(handle_value_error)
app.errorhandler(Exception)(handle_execution_error)

api.register_blueprint(entities)
api.register_blueprint(tiles)
app.register_blueprint(api)
