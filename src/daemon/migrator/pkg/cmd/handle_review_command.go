package cmd

import (
	"encoding/json"
	"migrator/pkg/api"
	"migrator/pkg/xml_reader/entities"
)

type HandleReviewCommand struct {
	Api *api.Api
}

type ReviewResponse struct {
	Points            int    `json:"points"`
	ReviewDescription string `json:"description"`
	WineTitle         string `json:"wine_title"`
	TwitterHandle     string `json:"twitter_handle"`
}

func (c *HandleReviewCommand) Execute(entity []byte) error {
	var review ReviewResponse

	if err := json.Unmarshal(entity, &review); err != nil {
		return err
	}

	// Get wine
	wine, err := c.Api.GetWineIfExists(review.WineTitle)

	if err != nil {
		return err
	}

	// Create wine
	if err := c.Api.CreateReview(&entities.Review{
		Points:            review.Points,
		ReviewDescription: review.ReviewDescription,
		TwitterHandle:     review.TwitterHandle,
		WineId:            wine.Id,
	}); err != nil {
		return err
	}

	return nil
}
