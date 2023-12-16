import hashlib
import os

def calculate_checksum(file_path: str):
    with open(file_path, "rb") as file:
        data = file.read()
        md5_hash = hashlib.md5(data).hexdigest()
        
    return md5_hash
