import xml.etree.ElementTree as ET

class XmlExporter():

    def _default_converter(self, entity, element) -> ET:
        el = ET.Element(element)
        el.set("id", str(entity.get_id()))

        return el

    def convertWine(self, wine) -> ET:
        el = self._default_converter(wine, "Wine")

        el.set("price", str(wine.get_price()))
        el.set("designation", wine.get_designation())
        el.set("country_id", str(wine.get_country_id()))
        el.set("region_id", str(wine.get_region_id()))
        el.set("variaty", str(wine.get_variaty()))
        el.set("winery", str(wine.get_winery()))
        el.set("title", str(wine.get_title()))

        return el

    def convertCountry(self, country) -> ET:
        el = self._default_converter(country, "Country")

        el.set("name", str(country.get_name()))

        return el

    def convertReview(self, review) -> ET:
        el = self._default_converter(review, "Review")

        el.set("taster_id", str(review.get_taster_id()))
        el.set("wine_id", str(review.get_wine_id()))
        el.set("points", str(review.get_points()))

        description_el = ET.Element("ReviewDescription")
        description_el.text = review.get_description()
        el.append(description_el)

        return el

    def convertTaster(self, taster) -> ET:
        el = self._default_converter(taster, "Taster")

        el.set("name", str(taster.get_name()))
        el.set("twitter_handle", str(taster.get_twitter_handle()))

        return el

    def convertRegion(self, region) -> ET:
        el = self._default_converter(region, "Region")

        el.set("region", region.get_region())
        el.set("province", region.get_province())
        el.set("lat", str(region.get_lat()))
        el.set("lon", str(region.get_lon()))

        return el
