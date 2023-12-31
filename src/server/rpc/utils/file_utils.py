import base64
import os

def encode_file(data):
    return base64.b64encode(data.encode('utf-8')).decode('utf-8')

def decode_file(encoded_data):
    return base64.b64decode(encoded_data.encode('utf-8')).decode('utf-8')

def store_file(file_name: str, file_data: str):
    with open(file_name, "w") as file:
        file.write(file_data)

    return True

def create_temp_file(file_path: str, file_data: str):
    try:
        return store_file(file_path, file_data)
    except Exception as e:
        return False

def delete_temp_file(file_path: str):
    try:
        return os.remove(file_path)
    except Exception as e:
        return False
