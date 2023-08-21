package handlers

import (
	"database/sql"

	"github.com/gofiber/fiber/v2"
	"github.com/sudharsangs/magnet-tv/server/pkg/config"
)

func SlateHandler(c *fiber.Ctx) error {
	var device Device
	ctx := c.Context()
	db := config.GetDB()
	entry := c.Params("entry")
	err := db.NewSelect().
		Model(&device).
		Where("slate = ?", entry).Scan(ctx)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "No entry for given slate",
			})
		} else {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
	} else {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "Slate entry found",
		})
	}
}
