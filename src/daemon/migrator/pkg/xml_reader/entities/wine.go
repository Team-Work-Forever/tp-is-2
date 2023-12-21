package entities

type Wine struct {
	Id          string  `xml:"id,attr"`
	Price       float32 `xml:"price,attr"`
	Designation string  `xml:"designation,attr"`
	CountryId   string  `xml:"country_id,attr"`
	RegionId    string  `xml:"region_id,attr"`
	Varaiety    string  `xml:"variety,attr"`
	Winery      string  `xml:"winery,attr"`
}
