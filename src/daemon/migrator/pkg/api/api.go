package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"migrator/pkg/config"
	"net/http"
)

type Api struct {
	baseUrl string
	client  *http.Client
}

func NewApi() *Api {
	config := config.GetConfig()

	return &Api{
		baseUrl: config.API_ENTITIES_URL,
		client:  &http.Client{},
	}
}

func (api *Api) postR(path string, requestData interface{}, response interface{}) error {
	resp, err := api.post(path, requestData)

	if err != nil {
		return err
	}

	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %v", err)
	}

	if err := json.Unmarshal(responseBody, response); err != nil {
		return fmt.Errorf("failed to unmarshal JSON: %v", err)
	}

	return nil
}

func (api *Api) post(path string, requestData interface{}) (*http.Response, error) {
	url := fmt.Sprintf("%s%s", api.baseUrl, path)

	requestBody, err := json.Marshal(requestData)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request data: %v", err)
	}

	resp, err := api.client.Post(url, "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, fmt.Errorf("failed to make POST request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		return resp, fmt.Errorf("unexpected status code %d", resp.StatusCode)
	}

	return resp, nil
}

func (api *Api) get(path string, response interface{}) error {
	url := fmt.Sprintf("%s%s", api.baseUrl, path)

	resp, err := api.client.Get(url)
	if err != nil {
		return fmt.Errorf("failed to make GET request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusBadRequest {
		return fmt.Errorf("unexpected status code %d", resp.StatusCode)
	}

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %v", err)
	}

	if err := json.Unmarshal(body, response); err != nil {
		return fmt.Errorf("failed to unmarshal JSON: %v", err)
	}

	return nil
}
