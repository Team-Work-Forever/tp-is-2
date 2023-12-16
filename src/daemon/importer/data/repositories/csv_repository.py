import os
import psycopg2

from data import db_access
from utils.file_utils import calculate_checksum

class CSVDataBaseRepository():
    def __init__(self):
        self.db_access = db_access.DbConnection()

    async def get_already_converted_files(self) -> [str]:
        """
        Returns a list of checksums of the files that were already converted
        """
        
        cursor = self.db_access.get_cursor()

        cursor.execute("SELECT checksum FROM converted_documents")
        data = [item[0] for item in cursor.fetchall()]
        
        return data

    def save(self, csv_path: str, destination_path: str) -> None:
        cursor = self.db_access.get_cursor()

        insertIntoConvertedFile ="""
            INSERT INTO public.converted_documents (
                src,
                file_size,
                dst,
                checksum)
            VALUES (
                %(src)s, 
                %(file_size)s,
                %(dst)s,
                %(checksum)s
            );"""
        
        try:
            cursor.execute(insertIntoConvertedFile, {
                "src": csv_path,
                "file_size": os.path.getsize(csv_path),
                "dst": destination_path,
                "checksum": calculate_checksum(csv_path)
            })

        except psycopg2.Error as e:
            return    