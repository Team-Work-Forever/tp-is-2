package entities

type Review struct {
	Id                string            `xml:"id,attr"`
	TasterId          string            `xml:"taster_id,attr"`
	WineId            string            `xml:"wine_id,attr"`
	Points            int               `xml:"points,attr"`
	ReviewDescription ReviewDescription `xml:"ReviewDescription"`
}

type ReviewDescription struct {
	Text string `xml:",chardata"`
}
