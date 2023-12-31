import datetime
from functions import Handler
from data import DbConnection

from datetime import datetime

class RemoveRecordHandler(Handler):
    def __init__(self) -> None:
        self.db_access = DbConnection()

    def get_name(self):
        return "remove_record"

    def handle(self, file_name: str):
        cursor = self.db_access.get_cursor()

        if not file_name:
            return self.send_error("File name is required")
        
        get_file = """
            SELECT * FROM imported_documents
            WHERE file_name = %(file_name)s and deleted_on is null;
        """

        query = """
            UPDATE imported_documents SET
                deleted_on = %(delete_on)s
            WHERE file_name = %(file_name)s;
        """

        try:
            cursor.execute(get_file, {
                'file_name': file_name,
            })

            if not cursor.fetchone():
                raise Exception("The record was not found or it was already deleted")

            cursor.execute(query, {
                'file_name': file_name,
                'delete_on': datetime.now()
            })

        except Exception as e:
            return self.send_error(str(e))

        self.db_access.commit()
        return "The record was removed from the database"