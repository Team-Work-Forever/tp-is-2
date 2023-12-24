package data

import (
	"context"
	"fmt"
	"migrator/pkg/config"

	"github.com/redis/go-redis/v9"
)

type RedisConnection struct {
	client *redis.Client
	ctx    context.Context
}

func CreateRedisConnection() *RedisConnection {
	config := config.GetConfig()

	return &RedisConnection{
		client: redis.NewClient(&redis.Options{
			Addr: fmt.Sprintf("%s:%s", config.REDIS_HOST, config.REDIS_PORT),
			DB:   config.REDIS_DB,
		}),
		ctx: context.Background(),
	}
}

func (r *RedisConnection) GetValue(key string) (string, error) {
	return r.client.Get(r.ctx, key).Result()
}

func (r *RedisConnection) SetValue(key string, value interface{}) error {
	return r.client.Set(r.ctx, key, value, 0).Err()
}

func (r *RedisConnection) Close() error {
	return r.client.Close()
}
