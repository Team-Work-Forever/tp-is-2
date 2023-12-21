package data

import (
	"migrator/pkg/config"

	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitMQConnection struct {
	rabbitmq *amqp.Connection
	config   *config.Config
}

func buildURL(config *config.Config) string {
	return "amqp://" + config.RABBIT_MQ_USERNAME + ":" + config.RABBIT_MQ_PASSWORD + "@" +
		config.RABBIT_MQ_HOST + ":" + config.RABBIT_MQ_PORT + "/" + config.RABBIT_MQ_VIRTUAL_HOST
}

func CreateRabbitMQ() (*RabbitMQConnection, error) {
	config := config.GetConfig()
	connection, err := amqp.Dial(buildURL(config))

	if err != nil {
		return nil, err
	}

	return &RabbitMQConnection{
		rabbitmq: connection,
		config:   config,
	}, nil
}

func (rc *RabbitMQConnection) ConsumeMessages() (<-chan amqp.Delivery, *amqp.Channel, error) {
	channel, err := rc.rabbitmq.Channel()

	if err != nil {
		return nil, channel, err
	}

	messages, err := channel.Consume(rc.config.RABBIT_MQ_QUEUE, "", true, false, false, false, nil)

	if err != nil {
		return nil, nil, err
	}

	return messages, channel, nil
}

func (rc *RabbitMQConnection) Close() error {
	return rc.rabbitmq.Close()
}
