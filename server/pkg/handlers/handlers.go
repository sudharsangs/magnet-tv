package handlers

import (
	"bufio"
	"context"
	"fmt"
	"io"
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
			data := fmt.Sprintf("data: Message: %s\n\n", msg.Payload)
			_, err := io.WriteString(c.Response().BodyWriter(), data)
			if err != nil {
				fmt.Printf("Error while writing SSE data: %v\n", err)
				break
			}
		}

	}))

	// Return immediately after setting up the SSE connection
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
		return err
	}

	return c.SendString("Data sent to SSE clients")
}

func QrHandler(c *fiber.Ctx) error {
	deviceId := c.Get("X-Device-Id")
	fmt.Println(deviceId)

	return nil
}
