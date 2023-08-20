package utils

import (
	"bytes"
	"context"
	"io"
	"log"
	"os"

	"github.com/kurin/blazer/b2"
)

func GetB2Bucket() (*b2.Bucket, error) {

	id := os.Getenv("B2_APPLICATION_KEY_ID")
	key := os.Getenv("B2_APPLICATION_KEY")
	bucketName := os.Getenv("B2_BUCKET_NAME")

	ctx := context.Background()

	b2, err := b2.NewClient(ctx, id, key)
	if err != nil {
		log.Fatalln(err)
		return nil, err
	}

	bucket, err := b2.Bucket(ctx, bucketName)
	if err != nil {
		log.Fatalln(err)
		return nil, err
	}
	return bucket, nil
}

func UploadFile(ctx context.Context, file []byte, dst string) (string, error) {
	r := bytes.NewReader(file)
	bucket, err := GetB2Bucket()
	if err != nil {
		return "", err
	}
	w := bucket.Object(dst).NewWriter(ctx)
	writers := 4
	w.ConcurrentUploads = writers

	if _, err := io.Copy(w, r); err != nil {
		w.Close()
		return "", err
	}
	base := bucket.BaseURL()
	bucketName := bucket.Name()

	return base + "/" + "file" + "/" + bucketName + "/" + dst, w.Close()
}
