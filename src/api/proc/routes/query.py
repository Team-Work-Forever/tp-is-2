from flask import Blueprint, jsonify, request
from errors.bad_request_error import BadRequestError
from mappers import toWineDto, toReviewFromWineryDto, toWineFromCountryDto, toWineryAvaragePointsDto
from services import RPConnection


query = Blueprint('query', __name__)
rpc_client = RPConnection()
    
def _validate_query_params():
    file_name = request.args.get('file_name', '')
    limit = request.args.get('limit', "10")
    order = request.args.get('order', "asc")

    if limit.isdigit() == False:
        raise BadRequestError("Limit must be a number")
    
    limit = int(limit)
    if limit < 0:
        raise BadRequestError("Limit must be a positive number")
    
    if order != "asc" and order != "desc":
        raise BadRequestError("Order must be asc or desc")

    return (file_name, limit, order)

# Get All Countries
@query.route('/countries', methods=['GET'])
def get_countries():
    countries = rpc_client.get_countries()
    return countries

# Get An Country Region
@query.route('/countries/<country>', methods=['GET'])
def get_country_regions(country: str):
    if not country:
        raise BadRequestError("Country is required")
    
    if not country.isalpha():
        raise BadRequestError("Please enter a valid country name (ex: Portugal)")

    regions = rpc_client.get_country_region(country)
    return regions

# Get Most Expensive Wines
@query.route('/wines/most_expensive', methods=['GET'])
def get_most_expensive_wines():
    file_name, limit, _ = _validate_query_params()

    wines = rpc_client.get_the_most_expensive_wines(file_name, limit)
    return jsonify(toWineDto(wines))

# Get Number Of Wines Per Country
@query.route('/wines/per_country', methods=['GET'])
def get_number_of_wines_per_country():
    response = rpc_client.get_country_wines()
    return jsonify(toWineFromCountryDto(response))

# Get Avarage Points per Wine
@query.route('/wines/avarage_points', methods=['GET'])
def get_avarage_points_per_wine():
    _, limit, order = _validate_query_params()

    response = rpc_client.get_average_points_per_wine(limit, order)
    return jsonify(toWineryAvaragePointsDto(response))

# Get Number Of Reviews By Winery
@query.route('/reviews/by_wineries', methods=['GET'])
def get_number_of_reviews_from_winery():
    file_name, limit, _ = _validate_query_params()

    response = rpc_client.get_number_reviews_winery(file_name, limit)
    return jsonify(toReviewFromWineryDto(response))

# Get Number Of Review Made By an Taster
@query.route('/reviews/by_tasters', methods=['GET'])
def get_number_of_review_made_by_an_taster():
    response = rpc_client.get_number_of_reviews_made_by_an_taster()
    return jsonify(toReviewFromWineryDto(response))