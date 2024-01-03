package entities

type Review struct {
	WineId            string
	Points            int    `json:"points"`
	ReviewDescription string `json:"description"`
	TwitterHandle     string `json:"twitterHandle"`
}

type ReviewDescription struct {
	Text string `xml:",chardata"`
}
