package main

import (
	"log"
	"migrator/pkg/cmd"
	"migrator/pkg/config"
	"migrator/pkg/data"
	"migrator/pkg/xml_reader"
	"os"
	"os/signal"
	"syscall"
)

const (
	THREADS_NUMBER = 5
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
	rabbitqm, err := data.GetRabbitMqConnection()

	if err != nil {
		log.Fatalf("Error connecting to RabbitMQ: %s", err.Error())
	}
	defer rabbitqm.Close()

	worker(redis, rabbitqm)
}

func worker(redis *data.RedisConnection, rabbitqm *data.RabbitMQConnection) {
	executer := cmd.NewCommandExecuter()

	hostname, _ := os.Hostname()

	messages, channel, err := rabbitqm.ConsumeMessages(hostname)
	defer channel.Close()

	if err != nil {
		log.Fatalf("Error consuming messages: %s", err.Error())
	}

	signalCh := make(chan os.Signal, 1)
	signal.Notify(signalCh, os.Interrupt, syscall.SIGTERM)

	log.Printf("Started to Listen for messages... %s\n", hostname)

	workerPool := make(chan struct{}, THREADS_NUMBER)

	for i := 0; i < THREADS_NUMBER; i++ {
		go func(workerID int) {
			for {
				select {
				case message, ok := <-messages:
					if !ok {
						return
					}

					// Acquire a worker slot
					workerPool <- struct{}{}

					go func() {
						// Release the worker slot when done
						defer func() {
							<-workerPool
						}()

						deliveryTag := message.DeliveryTag
						xmlValue := string(message.Body)

						xmlReader := xml_reader.NewXmlReader()
						wineReviews, err := xmlReader.DecodeResponse(xmlValue)

						if err != nil {
							log.Fatalf("Error decoding XML: %s", err.Error())
						}

						// Execute command
						executer.Handle(wineReviews)

						err = channel.Ack(deliveryTag, false)
						if err != nil {
							log.Printf("Error acknowledging message: %s", err.Error())
						}

						log.Printf("Worker %d: Migration successfully executed!", workerID)
					}()
				case <-signalCh:
					log.Println("Received interrupt signal. Gracefully shutting down worker", workerID)
					return
				}
			}
		}(i + 1)
	}

	// Wait for an interrupt signal
	<-signalCh
	log.Println("Received interrupt signal. Gracefully shutting down all workers...")
}
