package handlers

import (
	"bufio"
	"context"
	"database/sql"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/sudharsangs/magnet-tv/server/pkg/config"
	"github.com/sudharsangs/magnet-tv/server/pkg/utils"
	"github.com/uptrace/bun"
	"github.com/valyala/fasthttp"
)

type MagnetLinkBody struct {
	Link string `json:"link"`
}

type Device struct {
	bun.BaseModel      `bun:"table:devices,alias:d"`
	DeviceID           string `json:"deviceId"`
	QRCodeUrl          string `json:"qrCodeUrl"`
	UniqueId           string `json:"uniqueId"`
	UrlQueryParamValue string `json:"urlQueryParamValue"`
}

func SendMagenetLink(c *fiber.Ctx) error {
	c.Set("Content-Type", "text/event-stream")
	c.Set("Cache-Control", "no-cache")
	c.Set("Connection", "keep-alive")
	c.Set("Transfer-Encoding", "chunked")

	rdb := config.GetRedisClient()
	var ctx = context.Background()

	channelName := os.Getenv("REDIS_CHANNEL_NAME")

	pubsub := rdb.Subscribe(ctx, channelName)

	msgCh := pubsub.Channel()
	c.Context().SetBodyStreamWriter(fasthttp.StreamWriter(func(w *bufio.Writer) {

		for msg := range msgCh {

			data := fmt.Sprintf("data: %v", msg.Payload)
			fmt.Fprintf(w, "%s\n\n", data)

			err := w.Flush()
			if err != nil {
				fmt.Printf("Error while flushing: %v. Closing http connection.\n", err)
				break
			}
		}
	}))

	return nil
}

func ReceiveMagnetLink(c *fiber.Ctx) error {
	var postData MagnetLinkBody
	if err := c.BodyParser(&postData); err != nil {
		return err
	}

	rdb := config.GetRedisClient()
	var ctx = context.Background()
	channelName := os.Getenv("REDIS_CHANNEL_NAME")
	err := rdb.Publish(ctx, channelName, postData.Link).Err()
	if err != nil {
		return c.JSON(fiber.Map{
			"error": err,
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
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
			urlQueryParamValue := utils.GenerateQueryParamValue(deviceID, uniqueId)
			webBaseUrl := os.Getenv("WEB_BASE_URL")
			qrFormUrl := fmt.Sprintf("%vmagnet?slug=%v", webBaseUrl, urlQueryParamValue)
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
				DeviceID:           deviceID,
				UniqueId:           uniqueId,
				UrlQueryParamValue: urlQueryParamValue,
				QRCodeUrl:          qrUrl,
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
