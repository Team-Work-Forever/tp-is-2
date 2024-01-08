package entities

type Entity struct {
}

type Country struct {
	Entity
	Id      string   `xml:"id,attr"`
	Name    string   `xml:"name,attr" json:"name"`
	Regions []Region `xml:"Region" json:"regions"`
}
