from xmlrpc.client import ServerProxy

from helpers import SingletonMeta

class RPConnection(metaclass=SingletonMeta):
    def __init__(self) -> None:
        self._connect()

    def _connect(self):
        host = 'localhost'
        port = 9000

        try:
            self._connection = ServerProxy(f'http://{host}:{port}')
        except:
            raise Exception('Could not connect to RPC Server')

    def disconnect(self):
        self._connection = None

    def __getattr__(self, name):
        try:
            return getattr(self._connection, name)
        except:
            raise Exception('RPC Connection not established')