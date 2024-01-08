package cmd

import (
	"fmt"
	"log"
	"migrator/pkg/api"
	"migrator/pkg/data"
	"migrator/pkg/xml_reader/entities"
)

type HandleCountryCommand struct {
	Api *api.Api
}

type UpdateGisRequest struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Country   string  `json:"country"`
	Region    string  `json:"region"`
}

func (c *HandleCountryCommand) Execute(entity interface{}) error {
	country, ok := entity.(entities.Country)

	if !ok {
		return fmt.Errorf("expected Country, got %T", entity)
	}

	// get rabbitmq connection
	rabbimq, _ := data.GetRabbitMqConnection()

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

	// Publish to RabbitMQ
	for _, region := range country.Regions {
		if region.ShouldUpdateCoordinates() {
			if err := rabbimq.PublishMessage(&UpdateGisRequest{
				Latitude:  region.Latitude,
				Longitude: region.Longitude,
				Country:   country.Name,
				Region:    region.Region,
			}); err != nil {
				log.Printf("Error publishing message to RabbitMQ: %s", err)
				return err
			}
		}
	}

	return nil
}
