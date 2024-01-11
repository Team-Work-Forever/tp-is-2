package api

import (
	"fmt"
	"log"
	"migrator/pkg/xml_reader/entities"
	"net/http"
)

func (api *Api) CreateReview(review *entities.Review) error {
	log.Printf("Creating review with wine id: %s", review.Id)
	if response, err := api.post(fmt.Sprintf("wines/%s/reviews", review.WineId), review); err != nil {
		log.Printf("Error creating review: %s", err.Error())
		if response.StatusCode == http.StatusConflict {
			return AlreadyExistsError{fmt.Sprintf("Wine %s was already created.", review.Id)}
		}

		return err
	}

	return nil
}
