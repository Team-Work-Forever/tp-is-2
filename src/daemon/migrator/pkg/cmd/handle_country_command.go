package cmd

import (
	"fmt"
	"log"
	"migrator/pkg/api"
	"migrator/pkg/xml_reader/entities"
)

type HandleCountryCommand struct {
	Api *api.Api
}

func (c *HandleCountryCommand) Execute(entity interface{}) (string, error) {
	country, ok := entity.(entities.Country)

	if !ok {
		return "", fmt.Errorf("expected Country, got %T", entity)
	}

	log.Println("Converting Country:", country.Name)

	// Check if Country exists, and retrive the Country Id
	existingCountry, err := c.Api.GetCountryIfExists(country.Name)

	if err != nil {
		if _, notFound := err.(api.NotFoundError); notFound {
			// Country not found, create it
			if err := c.Api.CreateCountry(&country); err != nil {
				return "", err
			}

			fmt.Println("Create country:", country.Name)
		}

		return "", nil
	}

	// Update Country
	fmt.Println("Updating Country:", existingCountry.Id)

	// Tris to insert regions, if fails, it means that they already exist. So, we can ignore the error
	country.Id = existingCountry.Id
	if err := c.Api.AddRegionsToCountry(&country); err != nil {
		if _, ok := err.(api.AlreadyExistsError); !ok {
			return "", err
		}

		fmt.Println("Regions were inserted!")
		fmt.Println()
	}

	return "", nil
}