package entities

type Taster struct {
	Id            string
	Name          string `json:"name"`
	TwitterHandle string `json:"twitterHandle"`
}
