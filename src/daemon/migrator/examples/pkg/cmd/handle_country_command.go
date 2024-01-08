package cmd

import (
	"encoding/json"
	"migrator/pkg/api"
	"migrator/pkg/entities"
)

type HandleCountryCommand struct {
	Api *api.Api
}

func (c *HandleCountryCommand) Execute(entity []byte) error {
	var country entities.Country

	if err := json.Unmarshal(entity, &country); err != nil {
		return err
	}

	// Check if Country exists, and retrive the Country Id
	existingCountry, err := c.Api.GetCountryIfExists(country.Name)

	if err != nil {
		if _, notFound := err.(api.NotFoundError); notFound {
			// Country not found, create it
			if err := c.Api.CreateCountry(&country); err != nil {
				if _, ok := err.(api.AlreadyExistsError); !ok {
					return err
				}
			}
		}

		return nil
	}

	// Tris to insert regions, if fails, it means that they already exist. So, we can ignore the error
	country.Id = existingCountry.Id
	if err := c.Api.AddRegionsToCountry(&country); err != nil {
		if _, ok := err.(api.AlreadyExistsError); !ok {
			return err
		}
	}

	return nil
}
