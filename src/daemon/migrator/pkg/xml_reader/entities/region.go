package entities

type Region struct {
	Id        string  `xml:"id,attr"`
	Region    string  `xml:"region,attr" json:"name"`
	Province  string  `xml:"province,attr" json:"province"`
	Latitude  float64 `xml:"lat,attr" json:"lat"`
	Longitude float64 `xml:"lon,attr" json:"lon"`
}

func (r *Region) ShouldUpdateCoordinates() bool {
	return r.Latitude == 0 && r.Longitude == 0
}
