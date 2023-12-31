from flask import jsonify, request

from errors.http_error import HttpError
from utils.http_status_codes import HttpStatus

def handle_all_exceptions(error: HttpError):
    return jsonify({
        'message': error.message,
        "status": error.status,
        "path": request.path,
    }), error.status

def handle_value_error(error: ValueError):
    message = str(error)
    status = HttpStatus.BAD_REQUEST

    return jsonify({
        'message': message,
        "status": status,
        "path": request.path,
    }), status

def handle_execution_error(error: Exception):
    message = str(error)
    status = HttpStatus.INTERNAL_SERVER_ERROR

    return jsonify({
        'message': message,
        "status": status,
        "path": request.path,
    }), status