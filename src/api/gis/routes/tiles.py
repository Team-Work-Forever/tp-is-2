from flask import Blueprint, jsonify, request
from errors.bad_request_error import BadRequestError
from services.repositories.mark_repository import MarkRepository

mark_repository = MarkRepository()
tiles = Blueprint('tiles', __name__, url_prefix="/tile")

def check_latitude_range(latitude):
    if not (-90 <= latitude <= 90):
        raise BadRequestError("Latitude out of range: -90 to 90")

def check_longitude_range(longitude):
    if not (-180 <= longitude <= 180):
        raise BadRequestError("Longitude out of range: -180 to 180")

def get_coordinates_from_query():
    neLat, neLon, swLat, swLon = None, None, None, None

    try:
        neLat = float(request.args.get('neLat', '0'))
        neLon = float(request.args.get('neLon', '0'))
        swLat = float(request.args.get('swLat', '0'))
        swLon = float(request.args.get('swLon', '0'))
    except ValueError:
        raise BadRequestError("Please provide valid coordinates")

    if neLat is None or neLon is None or swLat is None or swLon is None:
        raise BadRequestError("Missing query parameters")
    
    check_latitude_range(neLat)
    check_latitude_range(swLat)
    check_longitude_range(neLon)
    check_longitude_range(swLon)

    if neLat < swLat or neLon < swLon:
        raise BadRequestError("Invalid query parameters")

    return neLat, neLon, swLat, swLon

@tiles.route("/")
def get_tiles():
    neLat, neLon, swLat, swLon = get_coordinates_from_query()
    response = mark_repository.get_selected_region(neLat, neLon, swLat, swLon)[0][0]

    if response['features'] is None:
        response['features'] = []
        
    return jsonify(response)