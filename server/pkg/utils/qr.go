package utils

import (
	"fmt"

	qrcode "github.com/skip2/go-qrcode"
)

func GenerateQRFromURL(url string) ([]byte, error) {
	png, err := qrcode.Encode(url, qrcode.Medium, 256)
	if err != nil {
		fmt.Println(err.Error())
		return []byte{}, err
	}
	return png, nil
}
