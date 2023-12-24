package entities

type Region struct {
	Id        string
	Region    string  `json:"name"`
	Province  string  `json:"province"`
	Latitude  float32 `json:"lat"`
	Longitude float32 `json:"lon"`
}
