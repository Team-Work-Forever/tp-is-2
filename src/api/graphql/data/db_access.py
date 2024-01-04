import psycopg2

from helpers import Env
from helpers import SingletonMeta

class DbConnection(metaclass=SingletonMeta):

    def __init__(self) -> None:
        self._connect()

    def _connect(self):
        self._connection = psycopg2.connect(
            user=Env.get_var("PG_REL_USER"),
            password=Env.get_var("PG_REL_PASSWORD"),
            host=Env.get_var("PG_REL_HOST"),
            port=Env.get_var("PG_REL_PORT"),
            database=Env.get_var("PG_REL_DATABASE"))
        
    def get_cursor(self):
        return self._connection.cursor()
    
    def commit(self):
        self._connection.commit()
    
    def rollback(self):
        self._connection.rollback()
    
    def disconnect(self):
        self._connection.close()