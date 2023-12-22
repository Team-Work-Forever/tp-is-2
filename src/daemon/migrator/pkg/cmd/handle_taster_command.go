package cmd

import (
	"fmt"
	"migrator/pkg/api"
	"migrator/pkg/xml_reader/entities"
)

type HandleTasterCommand struct {
	Api *api.Api
}

func (c *HandleTasterCommand) Execute(entity interface{}) (string, error) {
	taster, ok := entity.(entities.Taster)

	if !ok {
		return "", fmt.Errorf("expected Taster, got %T", entity)
	}

	// Persist Taster, eventhough it is may exist
	if err := c.Api.CreateTaster(&taster); err != nil {
		return "", err
	}

	return "", nil
}
