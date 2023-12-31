from xml_generation.handlers import XmlExporter
from .entity import Entity

class Region(Entity):

    def __init__(self, country_id, region, province):
        super().__init__("region")

        self._country_id = country_id
        self._region = self._default_region(region, province)
        self._province = province
        self._lat = 0
        self._lon = 0

    def _default_region(self, value: str, province: str):
        if value != "":
            return value

        return province

    def get_country_id(self):
        return self._country_id
    
    def get_region(self):
        return self._region
    
    def get_province(self):
        return self._province

    def get_lat(self):
        return self._lat

    def get_lon(self):
        return self._lon

    def set_lat(self, value: float):
        self._lat = value

    def set_lon(self, value: float):
        self._lon = value

    def to_xml(self, xmlConverter: XmlExporter):
        return xmlConverter.convertRegion(self)