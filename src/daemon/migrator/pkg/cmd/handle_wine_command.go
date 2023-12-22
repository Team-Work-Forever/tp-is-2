package cmd

import (
	"fmt"
	"migrator/pkg/api"
	"migrator/pkg/xml_reader/entities"
)

type HandleWineCommand struct {
	Api *api.Api
}

func (c *HandleWineCommand) Execute(entity interface{}) (string, error) {
	wine, ok := entity.(entities.Wine)

	if !ok {
		return "", fmt.Errorf("expected wine, got %T", entity)
	}

	// Create wine
	if err := c.Api.CreateWine(&wine); err != nil {
		return "", err
	}

	return "", nil
}
