package handlers

import (
	"bufio"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/sudharsangs/magnet-tv/server/pkg/config"
	"github.com/valyala/fasthttp"
)

type MagnetLinkBody struct {
	Link  string `json:"link"`
	Slate string `json:"slate"`
}

type MessageBody struct {
	Link     string
	DeviceID string
}

func SendMagenetLink(c *fiber.Ctx) error {
	c.Set("Content-Type", "text/event-stream")
	c.Set("Cache-Control", "no-cache")
	c.Set("Connection", "keep-alive")
	c.Set("Transfer-Encoding", "chunked")

	rdb := config.GetRedisClient()
	ctx := context.Background()
	deviceID := c.Get("X-Device-Id")

	fmt.Println(deviceID)

	channelName := os.Getenv("REDIS_CHANNEL_NAME")

	pubsub := rdb.Subscribe(ctx, channelName)

	msgCh := pubsub.Channel()

	c.Context().SetBodyStreamWriter(fasthttp.StreamWriter(func(w *bufio.Writer) {
		for msg := range msgCh {
			var message MessageBody
			if err := json.Unmarshal([]byte(msg.Payload), &message); err != nil {
				fmt.Println("48", err)
				fmt.Printf("Error while flushing: %v. Closing http connection.\n", err)
			}
			if deviceID == message.DeviceID {
				data := fmt.Sprintf("data: %v", message.Link)
				fmt.Fprintf(w, "%s\n\n", data)
			}
			err := w.Flush()
			if err != nil {
				fmt.Println("56", err)
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

	ctx := context.Background()
	var device Device
	db := config.GetDB()
	dbErr := db.NewSelect().
		Model(&device).
		Where("slate = ?", postData.Slate).Scan(ctx)

	if dbErr != nil {
		if dbErr == sql.ErrNoRows {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "No entry for given slate",
			})
		} else {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": dbErr.Error(),
			})
		}
	}
	rdb := config.GetRedisClient()

	channelName := os.Getenv("REDIS_CHANNEL_NAME")

	message := &MessageBody{
		DeviceID: device.DeviceID,
		Link:     postData.Link,
	}

	byteMessage, marshallErr := json.Marshal(message)

	if marshallErr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": marshallErr.Error(),
		})
	}

	err := rdb.Publish(ctx, channelName, byteMessage).Err()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}
