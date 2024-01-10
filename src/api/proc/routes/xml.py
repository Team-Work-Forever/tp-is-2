import base64
from flask import Blueprint, jsonify, request
from errors.bad_request_error import BadRequestError
from mappers import toFileDto, toMessage

from utils import HttpStatus

from services.rpc_connection import RPConnection


xml = Blueprint('xml', __name__)

def encode_file(data):
    return base64.b64encode(data).decode('utf-8')

def get_file_content(field_name: str = 'file', type = 'csv'):
    if field_name not in request.files:
        raise BadRequestError('No file part in the request')

    file = request.files['file']

    if file.filename == '':
        raise BadRequestError('No file selected for uploading')
    
    if not file.filename.endswith(type):
        raise BadRequestError(f"Please provide a valid {type} file")
    
    return file.read(), file.filename

def validate_param(param: str, param_name: str, ex: str):
    if not param:
        raise BadRequestError(f"{param_name} is required, to remove a file")
    
    if not param.isascii():
        raise BadRequestError(f"Please enter a valid {param_name} name (ex: {ex})")

# Import XML File
@xml.route('/files/import', methods=['POST'])
def import_xml_file():
    file_content, file_name = get_file_content(type='csv')
    file_content = encode_file(file_content)

    RPConnection().upload_file_to_xml(file_name, file_content)

    return jsonify(toMessage("File was imported!")), HttpStatus.CREATED

# # Get All Uploaded Files
# TODO: Would be nice to have more information about the files
@xml.route('/files/uploaded', methods=['GET'])
def get_all_uploaded_files():
    response = RPConnection().get_all_persisted_files()
        
    return jsonify(response), HttpStatus.OK

# Get Information about the Uploaded File
# TODO: Get file
@xml.route('/files/uploaded/<file_name>', methods=['GET'])
def get_information_about_file(file_name: str):
    validate_param(file_name, "file_name", "dataset.csv")
    response = RPConnection().get_file_info(file_name)

    return jsonify(toFileDto(response)), HttpStatus.OK

# Remove XML File
# TODO: It's necessary to have the id to remove the file
@xml.route('/files/uploaded/<file_name>', methods=['DELETE'])
def remove_uploaded_file(file_name: str):
    validate_param(file_name, "file_name", "dataset.csv")
    response = RPConnection().remove_record(file_name)

    return jsonify(toMessage(response)), HttpStatus.ACCEPTED

# # Upload and Validate XML File
@xml.route('/files/uploaded/validate', methods=['POST'])
def validate_xml_file():
    file_content, _ = get_file_content(type='xml')
    response = RPConnection().validate_xml_file(file_content)

    return jsonify(toMessage(response)), HttpStatus.ACCEPTED