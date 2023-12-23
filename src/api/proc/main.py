import sys

from services import RPConnection
from routes import app

from utils import Env

PORT = int(sys.argv[1]) if len(sys.argv) >= 2 else 7321

Env.load("env")

# Init RPC Connection
try:
    RPConnection()
except Exception as e:
    print(f"Error: {e}")

app.config["DEBUG"] = True
app.run(host=Env.get_var("API_POSC_HOST"), port=Env.get_var("API_POSC_PORT"))