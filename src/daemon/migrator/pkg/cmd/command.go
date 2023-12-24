package cmd

import (
	"migrator/pkg/api"
	"reflect"
)

type Command interface {
	Execute(entity []byte) error
}

type CommandExecuter struct {
	Api       *api.Api
	Commands  map[reflect.Type]Command
	CommandV2 map[string]Command
}

func NewCommandExecuter() *CommandExecuter {
	api := api.NewApi()

	return &CommandExecuter{
		Api: api,
		// Commands: map[reflect.Type]Command{
		// 	reflect.TypeOf(&entities.Country{}): &HandleCountryCommand{Api: api},
		// 	reflect.TypeOf(&entities.Wine{}):    &HandleWineCommand{Api: api},
		// 	reflect.TypeOf(&entities.Taster{}):  &HandleTasterCommand{Api: api},
		// 	reflect.TypeOf(&entities.Review{}):  &HandleReviewCommand{Api: api},
		// },
		CommandV2: map[string]Command{
			"create-country": &HandleCountryCommand{Api: api},
			"create-wine":    &HandleWineCommand{Api: api},
			"create-taster":  &HandleTasterCommand{Api: api},
			"create-review":  &HandleReviewCommand{Api: api},
		},
	}
}

// func (ce *CommandExecuter) Handle(wineReviews *entities.WineReviews) {
// 	ce.handle_list(wineReviews.Countries)
// 	ce.handle_list(wineReviews.Wines)
// 	ce.handle_list(wineReviews.Tasters)
// 	ce.handle_list(wineReviews.Reviews)
// }

func (ce *CommandExecuter) HandleV2(routerKey string, entity_json []byte) {
	command, ok := ce.CommandV2[routerKey]

	if !ok {
		return
	}

	command.Execute(entity_json)
}

// func (ce *CommandExecuter) handle_list(entities interface{}) error {
// 	slice := reflect.ValueOf(entities)

// 	if slice.Kind() != reflect.Slice {
// 		return fmt.Errorf("entities must be a slice")
// 	}

// 	for i := 0; i < slice.Len(); i++ {
// 		entity := slice.Index(i).Interface()

// 		entityType := reflect.TypeOf(entity)

// 		if entityType.Kind() != reflect.Ptr {
// 			entityType = reflect.PtrTo(entityType)
// 		}

// 		cmd, ok := ce.Commands[entityType]

// 		if !ok {
// 			return fmt.Errorf("unsupported entity type")
// 		}

// 		cmd.Execute(entity)
// 	}

// 	return nil
// }
