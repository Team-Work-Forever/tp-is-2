import sys

from helpers import Env

from services import DbConnection

PORT = int(sys.argv[1]) if len(sys.argv) >= 2 else 5001

# Load the environment variables
Env.load("env")

# Start the database connection
DbConnection()

from routes import app

# Start the server
app.config["DEBUG"] = True
app.run(host=Env.get_var("API_GIS_HOST"), port=Env.get_var("API_GIS_PORT"))