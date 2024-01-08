package entities

type WineReviews struct {
	Countries []Country `xml:"Countries>Country"`
	Wines     []Wine    `xml:"Wines>Wine"`
	Tasters   []Taster  `xml:"Tasters>Taster"`
	Reviews   []Review  `xml:"Reviews>Review"`
}
