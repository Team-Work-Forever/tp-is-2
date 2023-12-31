from data import DbConnection
from functions import Handler

class GetAllPersistedFilesHandler(Handler):
    def __init__(self) -> None:
        self.db_access = DbConnection()

    def get_name(self):
        return "get_all_persisted_files"

    def handle(self):
        cursor = self.db_access.get_cursor()
        cursor.execute("SELECT file_name FROM public.active_imported_documents")

        return [result[0] for result in cursor]