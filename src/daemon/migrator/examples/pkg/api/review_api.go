package api

import (
	"fmt"
	"migrator/pkg/entities"
	"net/http"
)

func (api *Api) CreateReview(review *entities.Review) error {
	if response, err := api.post(fmt.Sprintf("wines/%s/reviews", review.WineId), review); err != nil {
		if response.StatusCode == http.StatusConflict {
			return AlreadyExistsError{fmt.Sprintf("Wine %s was already created.", review.WineId)}
		}

		return err
	}

	return nil
}
