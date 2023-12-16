from xml_generation.handlers import XmlExporter
from .entity import Entity

class Taster(Entity):

    def __init__(self, name: str, twitter_handle: str):
        super().__init__("taster")

        self._name = name
        self._twitter_handle = twitter_handle

    def get_name(self):
        return self._name

    def get_twitter_handle(self):
        return self._twitter_handle
    
    def to_xml(self, xmlConverter: XmlExporter):
        return xmlConverter.convertTaster(self)