package cmd

import (
	"log"
	"migrator/pkg/api"
)

type HandleWineCommand struct {
	Api *api.Api
}

func (c *HandleWineCommand) Execute() (string, error) {
	log.Println("Hey Baby Came on! ;)")

	return "", nil
}
