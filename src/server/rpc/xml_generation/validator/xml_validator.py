import os
import xml.etree.ElementTree as ET
from lxml import etree

from helpers import Env

class XMLValidator():
    def __init__(self):
        self.XSD_SCHEMA = os.path.join(Env.get_var("SCHEMA_DIR"), Env.get_var("SCHEMA_FILE"))
        self._schema = etree.XMLSchema(etree.parse(self.XSD_SCHEMA))
    
    def is_valid_from_string(self, root_string):
        element = etree.fromstring(root_string)

        return self._schema.validate(element)

    def is_valid(self, root_el: ET) -> bool:
        element = etree.fromstring(ET.tostring(root_el))

        return self._schema.validate(element)