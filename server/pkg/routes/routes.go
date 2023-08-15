package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sudharsangs/magnet-tv/server/pkg/handlers"
)

var RegisterServerRoutes = func(app *fiber.App) {
	apiV1 := app.Group("/api/v1")
	apiV1.Get("/qr", handlers.QrHandler)
	apiV1.Post("/magnet", handlers.ReceiveMagnetLink)
	apiV1.Get("/magnet", handlers.SendMagenetLink)
}
