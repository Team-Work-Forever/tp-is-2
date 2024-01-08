package api

import (
	"fmt"
	"migrator/pkg/entities"
	"net/http"
	"net/url"
)

type WineResponse struct {
	Id string `json:"id"`
}

func (api *Api) GetWineIfExists(title string) (*WineResponse, error) {
	var wineId []WineResponse

	err := api.get(fmt.Sprintf("wines?title=%s", url.QueryEscape(title)), &wineId)

	if err != nil {
		return nil, err
	}

	if len(wineId) == 0 {
		return nil, NotFoundError{fmt.Sprintf("Wine %s not found", title)}
	}

	return &wineId[0], nil
}

func (api *Api) CreateWine(wine *entities.Wine) error {
	if response, err := api.post("wines", wine); err != nil {
		if response.StatusCode == http.StatusConflict {
			return AlreadyExistsError{fmt.Sprintf("Wine %s was already created.", wine.Title)}
		}

		return err
	}

	return nil
}
