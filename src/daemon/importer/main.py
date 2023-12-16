import time
from data.db_access import DbConnection

from helpers.env_loader import Env
from observer import FileObserver

# Load the environment variables
Env.load("dev")

# Initialize the database connection
DbConnection()

# Get the CSV and XML volumes
CSV_INPUT_PATH = Env.get_var("CSV_VOLUME")
XML_OUTPUT_PATH = Env.get_var("XML_VOLUME")

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