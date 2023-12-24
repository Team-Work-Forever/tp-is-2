package entities

type Entity struct {
}

type Country struct {
	Entity
	Id      string
	Name    string   `json:"name"`
	Regions []Region `json:"regions"`
}
