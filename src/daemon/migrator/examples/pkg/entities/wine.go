package entities

type Wine struct {
	Price       float32 `json:"price"`
	Designation string  `json:"designation"`
	Varaiety    string  `json:"variety"`
	Winery      string  `json:"winery"`
	Title       string  `json:"title"`
	RegionName  string  `json:"region"`
}
