import os

from dotenv import load_dotenv, find_dotenv

class Env():

    @staticmethod
    def load():
        script_path = find_dotenv(f'.env')
        load_dotenv(dotenv_path=script_path)

    @staticmethod
    def get_var(key, default=None):
        return os.getenv(key)