import os
import psycopg2

from helpers import Env

from functions import Handler
from xml_generation import CSVtoXMLConverter
from data import DbConnection
from utils import encode_file, decode_file, create_temp_file, delete_temp_file

class ConvertToXmlHandler(Handler):
    DATASET_PATH = "dataset.csv"

    def __init__(self) -> None:
        self.db_access = DbConnection()
        self.UPLOADS_FOLDER = Env.get_var("MAIN_DIR") + "/"
        self.TEMP_FILE = self.UPLOADS_FOLDER + "temp"

    def get_name(self):
        return "upload_file_to_xml"

    def updateFileIfExists(self, cursor, file_name, xml):
        query = """
            UPDATE imported_documents
                set xml = %(xml)s,
                    deleted_on = null
            where file_name = %(file_name)s
            ;
        """

        cursor.execute(query, {
            'file_name': file_name,
            'xml': xml
        })

    def check_if_file_exists(self, cursor, file_name):
        query = """
            SELECT * FROM imported_documents
            WHERE file_name = %(file_name)s and deleted_on is null;
        """

        cursor.execute(query, {
            'file_name': file_name
        })

        return cursor.fetchone()

    def handle(self, file_name: str, csv_file: str):
        cursor = self.db_access.get_cursor()

        # check if the file already exists
        if self.check_if_file_exists(cursor, file_name):
            return self.send_error("The file already exists")

        decoded_file = decode_file(csv_file)
        result = create_temp_file(self.TEMP_FILE, decoded_file)

        if not result:
            return self.send_error("Error converting to XML")

        try:
            converter = CSVtoXMLConverter(self.TEMP_FILE, file_name)
            xml_result = converter.to_xml_str()
            
        except Exception as e:
            print(e)
            return self.send_error("Error converting to XML")
        
        finally:
            delete_temp_file(self.TEMP_FILE)

        query = """
            INSERT INTO imported_documents 
            (file_name, xml)
            VALUES 
            (%(file_name)s, %(xml)s);
        """

        try:
            cursor.execute(query, {
                'file_name': file_name,
                'xml': xml_result
            })

        except psycopg2.errors.UniqueViolation as e:
            self.db_access.rollback()
            self.updateFileIfExists(cursor, file_name, xml_result)

        self.db_access.commit()
      
        return encode_file(xml_result)