package api

import (
	"fmt"
	"migrator/pkg/xml_reader/entities"
	"net/http"
)

type WineResponse struct {
	Id string `json:"id"`
}

// func (api *Api) GetWineById(twitter_handle string) (*WineResponse, error) {
// 	var wineIds []WineResponse

// 	err := api.get(fmt.Sprintf("wines?twitter_handle=%s", twitter_handle), &wineIds)

// 	if err != nil {
// 		return nil, err
// 	}

// 	if len(wineIds) == 0 {
// 		return nil, NotFoundError{fmt.Sprintf("wine %s not found", twitter_handle)}
// 	}

// 	return &wineIds[0], nil
// }

func (api *Api) CreateWine(wine *entities.Wine) error {
	if response, err := api.post("wines", wine); err != nil {
		if response.StatusCode == http.StatusConflict {
			return AlreadyExistsError{fmt.Sprintf("Wine %s was already created.", wine.Id)}
		}

		return err
	}

	return nil
}
