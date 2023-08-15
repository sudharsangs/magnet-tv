package config

import (
	"context"

	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()

var (
	rdb *redis.Client
)

func ConnectRedis(redisAddress string, redisPassword string) {
	rdb = redis.NewClient(&redis.Options{
		Addr:     redisAddress,
		Password: redisPassword,
		DB:       0,
	})

}

func GetRedisClient() *redis.Client {
	return rdb
}
