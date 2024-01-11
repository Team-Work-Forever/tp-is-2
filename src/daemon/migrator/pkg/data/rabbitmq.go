package data

import (
	"context"
	"encoding/json"
	"fmt"
	"migrator/pkg/config"

	amqp "github.com/rabbitmq/amqp091-go"
)

var rabbitmq *RabbitMQConnection = nil

type RabbitMQConnection struct {
	rabbitmq *amqp.Connection
	config   *config.Config
	ctx      context.Context
}

func buildURL(config *config.Config) string {
	return "amqp://" + config.RABBIT_MQ_USERNAME + ":" + config.RABBIT_MQ_PASSWORD + "@" +
		config.RABBIT_MQ_HOST + ":" + config.RABBIT_MQ_PORT + "/" + config.RABBIT_MQ_VIRTUAL_HOST
}

func GetRabbitMqConnection() (*RabbitMQConnection, error) {
	if rabbitmq != nil {
		return rabbitmq, nil
	}

	config := config.GetConfig()
	connection, err := amqp.Dial(buildURL(config))

	if err != nil {
		return nil, err
	}

	return &RabbitMQConnection{
		rabbitmq: connection,
		config:   config,
		ctx:      context.Background(),
	}, nil
}

func (rc *RabbitMQConnection) ConsumeMessages(consumer string) (<-chan amqp.Delivery, *amqp.Channel, error) {
	channel, err := rc.rabbitmq.Channel()

	if err != nil {
		return nil, channel, err
	}

	channel.Qos(
		1,
		0,
		false,
	)

	messages, err := channel.Consume(
		rc.config.RABBIT_MQ_QUEUE_ENTITIES,
		fmt.Sprintf("consumer-%s", consumer),
		true,
		false,
		false,
		false,
		nil)

	if err != nil {
		return nil, nil, err
	}

	return messages, channel, nil
}

func (rc *RabbitMQConnection) PublishMessage(payload interface{}) error {
	channel, err := rc.rabbitmq.Channel()

	if err != nil {
		return err
	}
	defer channel.Close()

	err = channel.ExchangeDeclare(
		rc.config.RABBIT_MQ_EXCHANGE, // Exchange name
		"direct",                     // Exchange type
		false,                        // Durable
		false,                        // Auto-deleted
		false,                        // Internal
		false,                        // No-wait
		nil,                          // Arguments
	)
	if err != nil {
		return err
	}

	jsonPayload, err := json.Marshal(payload)

	if err != nil {
		return err
	}

	err = channel.PublishWithContext(
		rc.ctx,
		rc.config.RABBIT_MQ_EXCHANGE, // Exchange
		"update-gis",                 // Routing key
		false,                        // Mandatory
		false,                        // Immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        jsonPayload,
		},
	)

	return err
}

func (rc *RabbitMQConnection) Close() error {
	return rc.rabbitmq.Close()
}
