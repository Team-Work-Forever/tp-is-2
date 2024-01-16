import pika
from helpers import SingletonMeta, Env


class MessageQueue(metaclass=SingletonMeta):
    def __init__(self) -> None:
        username = Env.get_var("RABBIT_MQ_USERNAME")
        password = Env.get_var("RABBIT_MQ_PASSWORD")
        host = Env.get_var("RABBIT_MQ_HOST")
        port = Env.get_var("RABBIT_MQ_PORT")
        self.queue = Env.get_var("RABBIT_MQ_QUEUE_POSTGIS")
        virtualHost = Env.get_var("RABBIT_MQ_VIRTUAL_HOST")

        connection_string = f"amqp://{username}:{password}@{host}:{port}/{virtualHost}"
        self.connection = pika.BlockingConnection(pika.URLParameters(connection_string))
        self.channel = self.connection.channel()

        self.channel.queue_declare(queue=self.queue)

    def start_consuming(self, callback):
        self.channel.basic_qos(prefetch_count=1)
        self.channel.basic_consume(queue=self.queue, on_message_callback=callback, auto_ack=True)
        self.channel.start_consuming()

    def close(self):
        self.connection.close()