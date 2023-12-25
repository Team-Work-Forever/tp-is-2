from errors.bad_request_error import BadRequestError
from flask import Blueprint, jsonify, request
from jsonschema import validate, ValidationError

from services.repositories.mark_repository import MarkRepository

mark_repository = MarkRepository()
markers = Blueprint('markers', __name__, url_prefix="/markers")

json_schema = {
    "type": "object",
    "properties": {
        "lat": {
            "type": "number",
            "description": "Latitude of the location",
            "minimum": -90,
            "maximum": 90
        },
        "lon": {
            "type": "number",
            "description": "Longitude of the location",
            "minimum": -180,
            "maximum": 180
        }
    },
    "required": ["lat", "lon"],
    "additionalProperties": False
}

# Get countries
@markers.route("/")
def get_markers():
    return "Hello, World!"

@markers.route("/<region_name>", methods=["POST"])
def set_markers(region_name: str):
    req = request.get_json()

    # Does not exist any region
    if mark_repository.check_if_region_exists(region_name) is False:
        raise BadRequestError("Region does not exist")

    try:
        validate(req, json_schema)
    except ValidationError as e:
        print(e.message)
        raise BadRequestError(e.message)
    
    # Update on the database
    try:
        mark_repository.update_gis_mark(region_name, req["lat"], req["lon"])
    except Exception as e:
        print(e)
        raise BadRequestError("Error updating the database")

    return jsonify(request.get_json())