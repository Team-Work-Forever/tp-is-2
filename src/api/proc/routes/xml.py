import base64
from flask import Blueprint, jsonify, request
from errors.bad_request_error import BadRequestError
from errors.conflitError import ConflitError
from mappers import toFileDto, toMessage

from utils import HttpStatus

from services.rpc_connection import RPConnection
import xmlrpc.client 


xml = Blueprint('xml', __name__)
rpc_client = RPConnection()

def encode_file(data):
    return base64.b64encode(data).decode('utf-8')

def get_file_content(field_name: str = 'file'):
    if field_name not in request.files:
        return 'No file part in the request'

    file = request.files['file']

    if file.filename == '':
        return 'No selected file'
    
    return file.read(), file.filename

def validate_param(param: str, param_name: str, ex: str):
    if not param:
        raise BadRequestError(f"{param_name} is required, to remove a file")
    
    if not param.isascii():
        raise BadRequestError(f"Please enter a valid {param_name} name (ex: {ex})")

# Import XML File
@xml.route('/files/import', methods=['POST'])
def import_xml_file():
    try:
        file_content, file_name = get_file_content()
        file_content = encode_file(file_content)

        rpc_client.upload_file_to_xml(file_name, file_content)

    except xmlrpc.client.Fault as e:
        raise BadRequestError("Please provide a valid CSV file")
    except Exception as e:
        raise ConflitError(str(e))

    return jsonify(toMessage("File was imported!")), HttpStatus.CREATED

# # Get All Uploaded Files
# TODO: Would be nice to have more information about the files
@xml.route('/files/uploaded', methods=['GET'])
def get_all_uploaded_files():
    response = ''

    try:
        response = rpc_client.get_all_files()
    except Exception as e:
        raise ConflitError(str(e))

    return jsonify(response), HttpStatus.OK

# Get Information about the Uploaded File
@xml.route('/files/uploaded/<file_name>', methods=['GET'])
def get_information_about_file(file_name: str):
    validate_param(file_name, "file_name", "dataset.csv")
    response = ''

    try:
        response = rpc_client.get_file_info(file_name)
    except Exception as e:
        raise ConflitError(str(e))

    return jsonify(toFileDto(response)), HttpStatus.OK

# Remove XML File
# TODO: It's necessary to have the id to remove the file
@xml.route('/files/uploaded/<file_name>', methods=['DELETE'])
def remove_uploaded_file(file_name: str):
    validate_param(file_name, "file_name", "dataset.csv")
    response = ''

    try:
        response = rpc_client.remove_record(file_name)

    except Exception as e:
        raise ConflitError(str(e))
    
    return jsonify(toMessage(response)), HttpStatus.ACCEPTED

# # Upload and Validate XML File
@xml.route('/files/uploaded/validate', methods=['POST'])
def validate_xml_file():
    response = ''
    
    try:
        file_content, _ = get_file_content()
        response = rpc_client.validate_xml_file(file_content.decode('utf-8'))

    except ValueError as e:
        raise BadRequestError("Please enter a valid XML file")
    except Exception as e:
        raise ConflitError(str(e))

    return jsonify(toMessage(response)), HttpStatus.ACCEPTED