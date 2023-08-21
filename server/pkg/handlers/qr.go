package handlers

import (
	"context"
	"database/sql"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/sudharsangs/magnet-tv/server/pkg/config"
	"github.com/sudharsangs/magnet-tv/server/pkg/utils"
	"github.com/uptrace/bun"
)

type Device struct {
	bun.BaseModel `bun:"table:devices,alias:d"`
	DeviceID      string `json:"deviceId"`
	QRCodeUrl     string `json:"qrCodeUrl"`
	QRFormUrl     string `json:"qrFormUrl"`
	UniqueId      string `json:"uniqueId"`
	Slate         string `json:"slate"`
}

func QrHandler(c *fiber.Ctx) error {
	ctx := c.Context()
	deviceID := c.Get("X-Device-Id")

	var device Device
	db := config.GetDB()
	err := db.NewSelect().
		Model(&device).
		Where("device_id = ?", deviceID).Scan(ctx)
	if err != nil {
		if err == sql.ErrNoRows {
			uniqueId := uuid.New().String()
			slate := utils.GenerateQueryParamValue(deviceID, uniqueId)
			webBaseUrl := os.Getenv("WEB_BASE_URL")
			qrFormUrl := fmt.Sprintf("%vmagnet?slate=%v", webBaseUrl, slate)
			imageFile, err := utils.GenerateQRFromURL(qrFormUrl)

			if err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": err,
				})
			}

			ctx := context.Background()
			destinationToPath := "qr/" + uniqueId
			qrUrl, err := utils.UploadFile(ctx, imageFile, destinationToPath)

			if err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": err,
				})
			}

			newDevice := &Device{
				DeviceID:  deviceID,
				UniqueId:  uniqueId,
				Slate:     slate,
				QRCodeUrl: qrUrl,
				QRFormUrl: qrFormUrl,
			}
			_, dbErr := db.NewInsert().Model(newDevice).Exec(ctx)

			if dbErr != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": dbErr,
				})
			}
			return c.Status(fiber.StatusOK).JSON(fiber.Map{
				"device": newDevice,
			})
		}
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"device": device,
	})
}
