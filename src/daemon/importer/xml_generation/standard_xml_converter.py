import xml.dom.minidom as md
import xml.etree.ElementTree as ET

from .handlers import XmlExporter

from .entities import Country
from .entities import Region
from .entities import Taster
from .entities import Wine
from .entities import Review

from .validator import XMLValidator
from .csv_reader import CSVReader

class CSVtoXMLConverter:

    def __init__(self, path, file_name = ''):
        self._reader = CSVReader(path)
        self.file_name = file_name
        self._countries = None
        self._regions = None
        self._tasters = None
        self._wines = None
        self._reviews = None

    def get_composite_key(self, *composite_key):
        return '-'.join([key for key in composite_key if key != ''])

    def read_countries(self):
         if self._countries is None:
            self._countries = self._reader.read_entities(
                attr=["country"],
                builder=lambda row: Country(row["country"])
            )

    def create_regions(self, row):
        value = row["region_1"]
        return value if value != "" else row["region_2"]

    def build_region(self, row):
        country = self._countries[row["country"]]
        
        region = self.create_regions(row)
        return Region(country.get_id(), region, row['province'])
    
    def read_region(self):
         if self._regions is None:
            self._regions = self._reader.read_entities(
                attr=["region_1", "region_2"],
                builder=lambda row: self.build_region(row)
            )
    
    def read_wine(self):
        if self._wines is None:
            self._wines = self._reader.read_entities(
                attr=["price", "variety", "winery"],
                builder=lambda row: Wine(
                    '0.0' if row["price"] == '' else row["price"], 
                    row["designation"],
                    self._countries[row["country"]].get_id(),
                    self._regions[self.get_composite_key(row["region_1"], row["region_2"])].get_id(),
                    row["variety"],
                    row["winery"])
            )
    
    def read_taster(self):
       if self._tasters is None:
            self._tasters = self._reader.read_entities(
                attr=["taster_name"],
                builder=lambda row: Taster(
                    row["taster_name"],
                    row["taster_twitter_handle"])
            )
    
    def read_review(self):
         if self._reviews is None:
            self._reviews = self._reader.read_entities(
                attr=["points", "description"],
                builder=lambda row: Review(
                    self._tasters[row["taster_name"]].get_id(),
                    self._wines[self.get_composite_key(row["price"], row["variety"], row["winery"])].get_id(),
                    '0' if row["points"] == '' else row["points"],
                    row["description"])
            )

    def to_xml(self):
        xml_converter = XmlExporter()

        self.read_countries()
        self.read_region()
        self.read_wine()
        self.read_taster()
        self.read_review()
        
        root_el = ET.Element("WineReviews")

        countries_el = ET.Element("Countries")

        for country in self._countries.values():
            country_parent = country.to_xml(xml_converter)
            countries_el.append(country_parent)
            
            for region in self._regions.values():
                if region.get_country_id() == country.get_id():
                    region_el = region.to_xml(xml_converter)
                    country_parent.append(region_el)

        wines_el = ET.Element("Wines")
        for wine in self._wines.values():
            wines_el.append(wine.to_xml(xml_converter))

        tasters_el = ET.Element("Tasters")
        for taster in self._tasters.values():
            tasters_el.append(taster.to_xml(xml_converter))

        reviews_el = ET.Element("Reviews")
        for review in self._reviews.values():
            review_parent = review.to_xml(xml_converter)
            reviews_el.append(review_parent)

        root_el.append(countries_el)
        root_el.append(wines_el)
        root_el.append(tasters_el)
        root_el.append(reviews_el)

        return root_el

    def to_xml_str(self, root_el: ET = None):
        xml = self.to_xml() if root_el is None else root_el
        validator = XMLValidator()

        if not validator.is_valid(xml):
            raise Exception("Document is not valid!")

        xml_str = ET.tostring(xml, encoding='utf8', method='xml').decode()
        dom = md.parseString(xml_str)
        return dom.toprettyxml()