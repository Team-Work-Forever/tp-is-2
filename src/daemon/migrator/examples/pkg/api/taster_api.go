package api

import (
	"fmt"
	"migrator/pkg/entities"
	"net/http"
)

type TasterResponse struct {
	Id string `json:"id"`
}

func (api *Api) GetTasterById(twitter_handle string) (*TasterResponse, error) {
	var tasterIds []TasterResponse

	err := api.get(fmt.Sprintf("tasters?twitter_handle=%s", twitter_handle), &tasterIds)

	if err != nil {
		return nil, err
	}

	if len(tasterIds) == 0 {
		return nil, NotFoundError{fmt.Sprintf("Taster %s not found", twitter_handle)}
	}

	return &tasterIds[0], nil
}

func (api *Api) CreateTaster(taster *entities.Taster) error {
	if response, err := api.post("tasters", taster); err != nil {
		if response.StatusCode == http.StatusConflict {
			return AlreadyExistsError{fmt.Sprintf("Taster %s was already created.", taster.TwitterHandle)}
		}

		return err
	}

	return nil
}
