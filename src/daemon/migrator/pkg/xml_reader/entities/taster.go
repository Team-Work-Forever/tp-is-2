package entities

type Taster struct {
	Id            string `xml:"id,attr"`
	Name          string `xml:"name,attr" json:"name"`
	TwitterHandle string `xml:"twitter_handle,attr" json:"twitterHandle"`
}
