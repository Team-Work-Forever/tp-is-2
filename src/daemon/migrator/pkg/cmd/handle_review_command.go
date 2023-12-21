package cmd

import (
	"log"
	"migrator/pkg/api"
)

type HandleReviewCommand struct {
	Api *api.Api
}

func (c *HandleReviewCommand) Execute() (string, error) {
	log.Println("Hey Baby Came on! ;)")

	return "", nil
}
