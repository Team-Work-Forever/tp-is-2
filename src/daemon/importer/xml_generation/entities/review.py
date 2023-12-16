from xml_generation.handlers import XmlExporter
from .entity import Entity

class Review(Entity):

    def __init__(self, taster_id, wine_id, points, description) -> None:
        super().__init__("review")

        self._taster_id = taster_id
        self._wine_id = wine_id
        self._points = points
        self._description = description

    def get_taster_id(self):
        return self._taster_id

    def get_wine_id(self):
        return self._wine_id

    def get_points(self):
        return self._points

    def get_description(self):
        return self._description
    
    def to_xml(self, xmlConverter: XmlExporter):
        return xmlConverter.convertReview(self)