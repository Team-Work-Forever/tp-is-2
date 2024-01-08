package cmd

import (
	"fmt"
	"migrator/pkg/api"
	"migrator/pkg/xml_reader/entities"
)

type HandleReviewCommand struct {
	Api *api.Api
}

func (c *HandleReviewCommand) Execute(entity interface{}) error {
	review, ok := entity.(entities.Review)

	if !ok {
		return fmt.Errorf("expected wine, got %T", entity)
	}

	// Get wine
	wine, err := c.Api.GetWineIfExists(review.WineTitle)

	if err != nil {
		return err
	}

	// Create wine
	review.WineId = wine.Id
	if err := c.Api.CreateReview(&review); err != nil {
		return err
	}

	return nil
}
