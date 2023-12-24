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
		CommandV2: map[string]Command{
			"create-country": &HandleCountryCommand{Api: api},
			"create-wine":    &HandleWineCommand{Api: api},
			"create-taster":  &HandleTasterCommand{Api: api},
			"create-review":  &HandleReviewCommand{Api: api},
		},
	}
}

func (ce *CommandExecuter) HandleV2(routerKey string, entity_json []byte) {
	command, ok := ce.CommandV2[routerKey]

	if !ok {
		return
	}

	command.Execute(entity_json)
}
