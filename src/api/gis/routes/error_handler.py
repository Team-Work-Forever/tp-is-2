from flask import jsonify, request

from errors.http_error import HttpError

def handle_all_exceptions(error: HttpError):
    return jsonify({
        'message': error.message,
        "status": error.status,
        "path": request.path,
    }), error.status