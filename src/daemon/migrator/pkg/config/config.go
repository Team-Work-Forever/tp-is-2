package config

import "github.com/spf13/viper"

var config *Config

type Config struct {
	REDIS_HOST               string
	REDIS_PORT               string
	REDIS_DB                 int
	RABBIT_MQ_HOST           string
	RABBIT_MQ_PORT           string
	RABBIT_MQ_USERNAME       string
	RABBIT_MQ_PASSWORD       string
	RABBIT_MQ_VIRTUAL_HOST   string
	RABBIT_MQ_EXCHANGE       string
	RABBIT_MQ_QUEUE_ENTITIES string
	RABBIT_MQ_QUEUE_POSTGIS  string
	RABBIT_MQ_ROUTING_KEY    string
	API_ENTITIES_URL         string
}

func LoadEnv(path string) error {
	viper.SetConfigName(path)
	viper.SetConfigType("env")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		viper.Reset()
	}

	config = &Config{
		REDIS_HOST: viper.GetString("REDIS_HOST"),
		REDIS_PORT: viper.GetString("REDIS_PORT"),
		REDIS_DB:   viper.GetInt("REDIS_DB"),

		RABBIT_MQ_HOST:           viper.GetString("RABBIT_MQ_HOST"),
		RABBIT_MQ_PORT:           viper.GetString("RABBIT_MQ_PORT"),
		RABBIT_MQ_USERNAME:       viper.GetString("RABBIT_MQ_USERNAME"),
		RABBIT_MQ_PASSWORD:       viper.GetString("RABBIT_MQ_PASSWORD"),
		RABBIT_MQ_VIRTUAL_HOST:   viper.GetString("RABBIT_MQ_VIRTUAL_HOST"),
		RABBIT_MQ_EXCHANGE:       viper.GetString("RABBIT_MQ_EXCHANGE"),
		RABBIT_MQ_QUEUE_ENTITIES: viper.GetString("RABBIT_MQ_QUEUE_ENTITIES"),
		RABBIT_MQ_QUEUE_POSTGIS:  viper.GetString("RABBIT_MQ_QUEUE_POSTGIS"),
		RABBIT_MQ_ROUTING_KEY:    viper.GetString("RABBIT_MQ_ROUTING_KEY"),
		API_ENTITIES_URL:         viper.GetString("MIGRATOR_API_URL"),
	}

	return nil
}

func GetConfig() *Config {
	return config
}
