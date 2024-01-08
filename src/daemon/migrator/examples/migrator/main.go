package main

import (
	"log"
	"migrator/pkg/cmd"
	"migrator/pkg/config"
	"migrator/pkg/data"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	// Load env vars
	if err := config.LoadEnv(".env"); err != nil {
		log.Fatalf("Error loading config: %s", err)
	}

	// Connect Redis
	redis := data.CreateRedisConnection()
	defer redis.Close()

	// Connect RabbitMQ
	rabbitqm, err := data.CreateRabbitMQ()

	if err != nil {
		log.Fatalf("Error connecting to RabbitMQ: %s", err.Error())
	}
	defer rabbitqm.Close()

	worker(redis, rabbitqm)
}

func worker(redis *data.RedisConnection, rabbitqm *data.RabbitMQConnection) {
	executer := cmd.NewCommandExecuter()

	messages, channel, err := rabbitqm.ConsumeMessages()
	defer channel.Close()

	if err != nil {
		log.Fatalf("Error consuming messages: %s", err.Error())
	}

	signalCh := make(chan os.Signal, 1)
	signal.Notify(signalCh, os.Interrupt, syscall.SIGTERM)

	log.Println("Started to Listen for messages...")

	for {
		select {
		case message, ok := <-messages:
			if !ok {
				return
			}

			if err != nil {
				log.Fatalf("Error getting value from Redis: %s", err.Error())
			}

			if err != nil {
				log.Fatalf("Error decoding XML: %s", err.Error())
			}

			// Execute command
			executer.HandleV2(message.RoutingKey, message.Body)
			log.Println("Migration successfully executed!")

		case <-signalCh:
			log.Println("Received interrupt signal. Gracefully shutting down...")
			return
		}
	}
}
