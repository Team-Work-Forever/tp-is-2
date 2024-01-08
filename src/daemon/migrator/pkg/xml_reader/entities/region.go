package entities

type Region struct {
	Id        string  `xml:"id,attr"`
	Region    string  `xml:"region,attr" json:"name"`
	Province  string  `xml:"province,attr" json:"province"`
	Latitude  float32 `xml:"lat,attr" json:"lat"`
	Longitude float32 `xml:"lon,attr" json:"lon"`
}
