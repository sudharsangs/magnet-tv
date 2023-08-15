package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"github.com/sudharsangs/magnet-tv/server/pkg/config"
	"github.com/sudharsangs/magnet-tv/server/pkg/routes"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	app := fiber.New()

	dbConnectionUrl := os.Getenv("DB_CONNECTION_URL")
	config.ConnectDB(dbConnectionUrl)

	redisAddress := os.Getenv("REDIS_ADDRESS")
	redisPassword := os.Getenv("REDIS_PASSWORD")
	config.ConnectRedis(redisAddress, redisPassword)

	routes.RegisterServerRoutes(app)
	app.Listen(":3006")
}
