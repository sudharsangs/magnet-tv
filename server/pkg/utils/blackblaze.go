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

func UploadFile(ctx context.Context, bucket *b2.Bucket, writers int, file []byte, dst string) error {
	r := bytes.NewReader(file)

	w := bucket.Object(dst).NewWriter(ctx)
	w.ConcurrentUploads = writers

	if _, err := io.Copy(w, r); err != nil {
		w.Close()
		return err
	}

	return w.Close()
}
