package cmd

import (
	"encoding/json"
	"migrator/pkg/api"
	"migrator/pkg/entities"
)

type HandleTasterCommand struct {
	Api *api.Api
}

type TasterResponse struct {
	Name          string `json:"name"`
	TwitterHandle string `json:"twitter_handle"`
}

func (c *HandleTasterCommand) Execute(entity []byte) error {
	var taster TasterResponse

	if err := json.Unmarshal(entity, &taster); err != nil {
		return err
	}

	// Persist Taster, eventhough it is may exist
	if err := c.Api.CreateTaster(&entities.Taster{
		Name:          taster.Name,
		TwitterHandle: taster.TwitterHandle,
	}); err != nil {
		return err
	}

	return nil
}
