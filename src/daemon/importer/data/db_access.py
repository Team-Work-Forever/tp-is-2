import psycopg2

from helpers import Env
from helpers import SingletonMeta

class DbConnection(metaclass=SingletonMeta):

    def __init__(self) -> None:
        self._connect()

    def _connect(self):
        print("Connecting to database...")

        self._connection = psycopg2.connect(
            user=Env.get_var("PG_XML_USER"),
            password=Env.get_var("PG_XML_PASSWORD"),
            host=Env.get_var("PG_XML_HOST"),
            port=Env.get_var("PG_XML_PORT"),
            database=Env.get_var("PG_XML_DATABASE"))
        
    def get_cursor(self):
        return self._connection.cursor()
    
    def commit(self):
        self._connection.commit()
    
    def rollback(self):
        self._connection.rollback()
    
    def disconnect(self):
        self._connection.close()