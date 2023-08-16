package handlers

import (
	"bufio"
	"context"
	"database/sql"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/sudharsangs/magnet-tv/server/pkg/config"
	"github.com/uptrace/bun"
	"github.com/valyala/fasthttp"
)

type MagnetLinkBody struct {
	Link string `json:"link"`
}

type Device struct {
	bun.BaseModel `bun:"table:devices,alias:d"`
	DeviceID      string `json:"deviceId"`
	QRCode        string `json:"qrCode"`
	UniqueId      string `json:"uniqueId"`
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
		fmt.Println(err)
		if err == sql.ErrNoRows {
			fmt.Println(err)
			newDevice := &Device{
				DeviceID: deviceID,
			}
			err := db.NewInsert().Model(newDevice)
			if err != nil {
				fmt.Println(err)
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": err,
				})
			}
		}
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"device": device,
	})
}
