package entities

type Review struct {
	Id                string `xml:"id,attr"`
	TasterId          string `xml:"taster_id,attr"`
	WineId            string `xml:"wine_id,attr" json:"wineId"`
	Points            int    `xml:"points,attr" json:"points"`
	ReviewDescription string `xml:"Review>ReviewDescription" json:"description"`
	TwitterHandle     string `json:"twitterHandle"`
	WineTitle         string
}

type ReviewDescription struct {
	Text string `xml:",chardata"`
}
