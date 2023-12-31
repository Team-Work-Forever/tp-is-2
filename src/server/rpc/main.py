import signal, sys

from helpers import Env

from xmlrpc.server import SimpleXMLRPCServer
from xmlrpc.server import SimpleXMLRPCRequestHandler

from data import DbConnection, RedisConnection
from functions import load_handlers_by_assembly

if len(sys.argv) > 1:
    enviroment = sys.argv[1]
else:
    enviroment = 'prod'

Env.load('prod')

redisAccess = RedisConnection()
dbAccess = DbConnection()

class RequestHandler(SimpleXMLRPCRequestHandler):
    rpc_paths = ('/RPC2',)

register_methods = load_handlers_by_assembly()

with SimpleXMLRPCServer(('0.0.0.0', 9000), requestHandler=RequestHandler) as server:
    server.register_introspection_functions()

    def signal_handler(signum, frame):
        print("received signal")
        server.server_close()
        
        redisAccess.disconnect()
        dbAccess.disconnect()

        print("exiting, gracefully")
        sys.exit(0)


    # signals
    signal.signal(signal.SIGTERM, signal_handler)
    signal.signal(signal.SIGHUP, signal_handler)
    signal.signal(signal.SIGINT, signal_handler)

    # register both functions
    for method in register_methods:
        server.register_function(method.handle, method.get_name())

    # start the server
    print("Starting the RPC Server...")
    server.serve_forever()