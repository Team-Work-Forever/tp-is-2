import sys

from services import RPConnection
from routes import app

PORT = int(sys.argv[1]) if len(sys.argv) >= 2 else 7321

# Init RPC Connection
try:
    RPConnection()
except Exception as e:
    print(f"Error: {e}")

app.config["DEBUG"] = True
app.run(host="0.0.0.0", port=PORT)