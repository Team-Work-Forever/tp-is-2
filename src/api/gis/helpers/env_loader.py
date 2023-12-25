import os

from dotenv import load_dotenv, find_dotenv

class Env():

    @staticmethod
    def load(enviroment):
        if enviroment:
            enviroment = f'.env.{enviroment}'
        else:
            enviroment = '.env'

        script_path = find_dotenv()
        load_dotenv(dotenv_path=script_path)

    @staticmethod
    def get_var(key, default=None):
        return os.getenv(key)