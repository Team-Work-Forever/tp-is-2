from xml_generation.handlers import XmlExporter
from .entity import Entity

class Country(Entity):

    def __init__(self, name) -> None:
        super().__init__("country")

        self._name = name

    def to_xml(self, xmlConverter: XmlExporter):
        return xmlConverter.convertCountry(self)

    def get_name(self):
        return self._name