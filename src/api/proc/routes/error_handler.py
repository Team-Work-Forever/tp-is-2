import xmlrpc.client

from flask import jsonify, request
from errors.http_error import HttpError
from utils.http_status_codes import HttpStatus

def handle_all_exceptions(error: HttpError):
    return jsonify({
        'message': error.message,
        "status": error.status,
        "path": request.path,
    }), error.status

def handle_value_errors(error: ValueError):
    message = str(error)
    status = HttpStatus.BAD_REQUEST

    return jsonify({
        'message': message,
        "status": status,
        "path": request.path,
    }), status

def handle_rpc_exceptions(error: xmlrpc.client.Fault):
    message = error.faultString
    status = HttpStatus.CONFLICT

    return jsonify({
        'message': message,
        "status": status,
        "path": request.path,
    }), status

def handle_internal_server_error(error: Exception):
    message = str(error)
    status = HttpStatus.INTERNAL_SERVER_ERROR

    import traceback
    traceback.print_exc()

    return jsonify({
        'message': message,
        "status": status,
        "path": request.path,
    }), status