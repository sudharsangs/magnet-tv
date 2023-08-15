package utils

import (
	"bytes"
	"net/http"
)

func httpCall(method, baseURI string, path, reqBody string, params, headers map[string]string) (resp *http.Response, err error) {

	url := baseURI + path
	body := bytes.NewBufferString(reqBody)
	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return resp, err
	}

	for k, v := range headers {
		req.Header.Set(k, v)
	}

	if params != nil {
		q := req.URL.Query()
		for k, v := range params {
			q.Set(k, v)
		}
		req.URL.RawQuery = q.Encode()
	}

	c := http.DefaultClient

	resp, err = c.Do(req)

	return resp, err
}
