package api

import (
	"fmt"
	"migrator/pkg/xml_reader/entities"
	"net/http"
)

type CountryResponse struct {
	Id string `json:"id"`
}

func (api *Api) GetCountryIfExists(countryName string) (*CountryResponse, error) {
	var countryId []CountryResponse

	err := api.get(fmt.Sprintf("countries?name=%s", countryName), &countryId)

	if err != nil {
		return nil, err
	}

	if len(countryId) == 0 {
		return nil, NotFoundError{fmt.Sprintf("Country %s not found", countryName)}
	}

	return &countryId[0], nil
}

func (api *Api) CreateCountry(country *entities.Country) error {
	if _, err := api.post("countries", country); err != nil {
		return err
	}

	return nil
}

func (api *Api) AddRegionsToCountry(country *entities.Country) error {
	if response, err := api.post(fmt.Sprintf("countries/%s/regions", country.Id), country.Regions); err != nil {
		if response.StatusCode == http.StatusConflict {
			return AlreadyExistsError{fmt.Sprintf("Country %s already has regions", country.Name)}
		}

		return err
	}

	fmt.Printf("Regions were inserted!\n\n")
	return nil
}
