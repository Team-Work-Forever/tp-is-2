package cmd

import (
	"encoding/json"
	"migrator/pkg/api"
	"migrator/pkg/entities"
)

type HandleWineCommand struct {
	Api *api.Api
}

func (c *HandleWineCommand) Execute(entity []byte) error {
	var wine entities.Wine

	if err := json.Unmarshal(entity, &wine); err != nil {
		return err
	}

	// Create wine
	if err := c.Api.CreateWine(&wine); err != nil {
		return err
	}

	return nil
}
