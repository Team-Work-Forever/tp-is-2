
from flask import Blueprint, jsonify, request
from jsonschema import validate
from errors.bad_request_error import BadRequestError
from services.repositories.mark_repository import MarkRepository


mark_repository = MarkRepository()
entities = Blueprint('entities', __name__, url_prefix="/entity")

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


@entities.route("/<region_name>", methods=["PATCH"])
def set_tiles(region_name: str):
    req = request.get_json()

    # Does not exist any region
    if mark_repository.check_if_region_exists(region_name) is False:
        raise BadRequestError("Region does not exist")

    validate(req, json_schema)

    # Update on the database
    mark_repository.update_gis_mark(region_name, req["lat"], req["lon"])

    return jsonify(request.get_json())