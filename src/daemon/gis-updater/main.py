import asyncio, json

from helpers import Env
from services.gis_api import GisApi
from services.rabbitmq_consumer import MessageQueue

from services.nominatim import NominatimApi

# Load environment variables
Env.load()

nomatium_api = NominatimApi()
gis_api = GisApi()

def recive_message(ch, method, properties, body):
    # Recive Message
    data = json.loads(body)

    # Get Coordinates
    lat, lon = asyncio.run(nomatium_api.get_value(data['country'], data['region']))

    if lat == 0 or lon == 0:
        print(f"Error getting coordinates... {lat}, {lon}")
        return

    # Publish it on API-GIS
    asyncio.run(gis_api.publish_coordinates(data['region'], lat, lon))
    print(f"Publishing new coordinates... {lat}, {lon}")

# Start RabbitMq Connection
print(" [*] Waiting for messages. To exit press CTRL+C")

try:
    # Get Some entities each time to not overload the API
    message_queue = MessageQueue()
    message_queue.start_consuming(recive_message)
except KeyboardInterrupt:
    print('Interrupted')
    message_queue.close()
    exit(0)
