package xml_reader

import (
	"encoding/xml"
	"io"
	"migrator/pkg/api"
	"migrator/pkg/xml_reader/entities"
)

type XmlReader struct {
	Api *api.Api
}

func NewXmlReader() *XmlReader {
	return &XmlReader{
		Api: api.NewApi(),
	}
}

func (xr *XmlReader) DecodeResponse(reader io.Reader) (*entities.WineReviews, error) {
	var wineReview entities.WineReviews

	decoder := xml.NewDecoder(reader)
	err := decoder.Decode(&wineReview)

	if err != nil {
		return nil, err
	}

	return &wineReview, nil
}
