package cmd

import (
	"fmt"
	"log"
	"migrator/pkg/api"
	"migrator/pkg/xml_reader/entities"
	"reflect"
)

type Command interface {
	Execute(entity interface{}) error
}

type CommandExecuter struct {
	Api      *api.Api
	Commands map[reflect.Type]Command
}

func NewCommandExecuter() *CommandExecuter {
	api := api.NewApi()

	return &CommandExecuter{
		Api: api,
		Commands: map[reflect.Type]Command{
			reflect.TypeOf(&entities.Country{}): &HandleCountryCommand{Api: api},
			reflect.TypeOf(&entities.Wine{}):    &HandleWineCommand{Api: api},
			reflect.TypeOf(&entities.Taster{}):  &HandleTasterCommand{Api: api},
			reflect.TypeOf(&entities.Review{}):  &HandleReviewCommand{Api: api},
		},
	}
}

func (ce *CommandExecuter) Handle(wineReviews *entities.WineReviews) {
	log.Println("Handling entities...")
	ce.handle_list(wineReviews.Countries)
	ce.handle_list(wineReviews.Wines)
	ce.handle_list(wineReviews.Tasters)
	ce.handle_list(wineReviews.Reviews)
}

func (ce *CommandExecuter) handle_list(entities interface{}) error {
	slice := reflect.ValueOf(entities)

	if slice.Kind() != reflect.Slice {
		return fmt.Errorf("entities must be a slice")
	}

	for i := 0; i < slice.Len(); i++ {
		entity := slice.Index(i).Interface()

		entityType := reflect.TypeOf(entity)

		if entityType.Kind() != reflect.Ptr {
			entityType = reflect.PtrTo(entityType)
		}

		cmd, ok := ce.Commands[entityType]

		if !ok {
			return fmt.Errorf("unsupported entity type")
		}

		cmd.Execute(entity)
	}

	return nil
}
