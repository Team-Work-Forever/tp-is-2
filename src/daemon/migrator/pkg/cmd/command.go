package cmd

import (
	"fmt"
	"migrator/pkg/api"
	"migrator/pkg/xml_reader/entities"
	"reflect"
)

type Command interface {
	Execute(entity interface{}) (string, error)
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
			reflect.TypeOf(&entities.Taster{}):  &HandleTasterCommand{Api: api},
		},
	}
}

func (ce *CommandExecuter) Handle(wineReviews *entities.WineReviews) {
	ce.handle_list(wineReviews.Countries)
	ce.handle_list(wineReviews.Tasters)
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

		// run command
		if _, err := cmd.Execute(entity); err != nil {
			fmt.Println("Error executing command:", err)
			return err
		}
	}

	return nil
}
