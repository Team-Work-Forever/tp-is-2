from xml_generation.handlers import XmlExporter
from .entity import Entity

class Wine(Entity):
    def __init__(self, price, designation, country_id, region_id, variaty, winery):
        super().__init__("wine")

        self._price = price
        self._designation = designation
        self._country_id = country_id
        self._region_id = region_id
        self._variaty = variaty
        self._winery = winery

    def get_price(self):
        return self._price

    def get_designation(self):
        return self._designation
    
    def get_country_id(self):
        return self._country_id

    def get_region_id(self):
        return self._region_id
    
    def get_region_2_id(self):
        return self._region_2_id
    
    def get_variaty(self):
        return self._variaty
    
    def get_winery(self):
        return self._winery
    
    def to_xml(self, xmlConverter: XmlExporter):
        return xmlConverter.convertWine(self)

    def __str__(self) -> str:
        return f"{self._price} {self._designation} ({self._id})"