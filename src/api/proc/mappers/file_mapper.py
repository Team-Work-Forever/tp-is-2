from collections import OrderedDict
from datetime import datetime

def toFileDto(file: []):
    created_at = str(file[3])
    updated_at = str(file[4])

    return {
        "id" : file[0],
        "file_name" : file[1],
        "created_at" : datetime.strptime(created_at, '%Y%m%dT%H:%M:%S'),
        "updated_at" : datetime.strptime(updated_at, '%Y%m%dT%H:%M:%S')
    }