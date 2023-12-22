package entities

type Wine struct {
	Id          string  `xml:"id,attr"`
	Price       float32 `xml:"price,attr" json:"price"`
	Designation string  `xml:"designation,attr" json:"designation"`
	CountryId   string  `xml:"country_id,attr"`
	RegionId    string  `xml:"region_id,attr"`
	Varaiety    string  `xml:"variety,attr" json:"variety"`
	Winery      string  `xml:"winery,attr" json:"winery"`
	RegionName  string  `json:"region"`
}
