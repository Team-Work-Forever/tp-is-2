package api

import (
	"fmt"
	"migrator/pkg/xml_reader/entities"
	"net/http"
)

func (api *Api) CreateReview(review *entities.Review) error {
	if response, err := api.post(fmt.Sprintf("wines/%s/reviews", review.WineId), review); err != nil {
		if response.StatusCode == http.StatusConflict {
			return AlreadyExistsError{fmt.Sprintf("Wine %s was already created.", review.Id)}
		}

		return err
	}

	return nil
}
