package api

import (
	"fmt"
	"migrator/pkg/xml_reader/entities"
	"net/http"
	"net/url"
)

type WineResponse struct {
	Data []struct {
		Id string `json:"id"`
	} `json:"data"`
}

func (api *Api) GetWineIfExists(title string) (*entities.Wine, error) {
	var response WineResponse

	err := api.get(fmt.Sprintf("wines?title=%s", url.QueryEscape(title)), &response)

	if err != nil {
		return nil, err
	}

	if len(response.Data) == 0 {
		return nil, NotFoundError{fmt.Sprintf("Wine %s not found", title)}
	}

	return &entities.Wine{
		Id: response.Data[0].Id,
	}, nil
}

func (api *Api) CreateWine(wine *entities.Wine) error {
	if response, err := api.post("wines", wine); err != nil {
		if response.StatusCode == http.StatusConflict {
			return AlreadyExistsError{fmt.Sprintf("Wine %s was already created.", wine.Id)}
		}

		return err
	}

	return nil
}
