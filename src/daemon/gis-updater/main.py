import asyncio, json
import time

from helpers import Env
from services.gis_api import GisApi
from services.rabbitmq_consumer import MessageQueue

from services.nominatim import NominatimApi

# Load environment variables
Env.load()

nomatium_api = NominatimApi()
gis_api = GisApi()

def recive_message(ch, method, properties, body):
    try:
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

        # ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print(f"Error: {e}")

# Start RabbitMq Connection
def consume_messages():
    while True:
        try:
            print(" [*] Waiting for messages. To exit press CTRL+C")
            message_queue = MessageQueue()
            message_queue.start_consuming(recive_message)
        except KeyboardInterrupt:
            print('Interrupted')
            break
        except Exception as e:
            print(f"Error consuming messages: {e}")
            print("Reconnecting in 1 seconds...")
            time.sleep(1)
        finally:
            message_queue.close()

if __name__ == "__main__":
    consume_messages()