import psycopg2

from data import db_access

class XMLDataBaseRepository():
    def __init__(self):
        self.db_access = db_access.DbConnection()

    def save(self, xml_file_name: str, xml_file_content: str) -> None:
        cursor = self.db_access.get_cursor()

        insertImportedFile = """
            INSERT INTO public.imported_documents(
                file_name,
                xml)
            VALUES (
                %(file_name)s, 
                %(xml)s
            );"""
        
        try:
            cursor.execute(insertImportedFile, {
                "file_name": xml_file_name,
                "xml": xml_file_content
            })

        except psycopg2.Error as e:
            return