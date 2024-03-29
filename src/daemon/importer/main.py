import time
from data import DbConnection, RedisConnection

from helpers.env_loader import Env
from observer import FileObserver

# Load the environment variables
Env.load("dev")

# Initialize the database connection
DbConnection()
RedisConnection()

# Get the CSV and XML volumes
CSV_INPUT_PATH = Env.get_var("IMPORTER_CSV_VOLUME")
XML_OUTPUT_PATH = Env.get_var("IMPORTER_XML_VOLUME")

# Initialize the file observer
observer = FileObserver()
observer.schedule(CSV_INPUT_PATH, XML_OUTPUT_PATH)
observer.start()    

# Run the observer
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    observer.stop()
    observer.join()