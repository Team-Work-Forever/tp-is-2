package xml_reader

import (
	"encoding/xml"
	"fmt"
	"migrator/pkg/api"
	"migrator/pkg/xml_reader/entities"
	"strings"

	"github.com/antchfx/xmlquery"
)

type XmlReader struct {
	Api *api.Api
}

func NewXmlReader() *XmlReader {
	return &XmlReader{
		Api: api.NewApi(),
	}
}

func (xr *XmlReader) DecodeResponse(reader string) (*entities.WineReviews, error) {
	var wineReview entities.WineReviews
	// Rewind the reader to the beginning using a buffer
	doc, err := xmlquery.Parse(strings.NewReader(reader))

	if err != nil {
		return nil, err
	}

	decoder := xml.NewDecoder(strings.NewReader(reader))
	err = decoder.Decode(&wineReview)

	if err != nil {
		return nil, err
	}

	// get the region name from the region id
	for i := range wineReview.Wines {

		xpathExpr := fmt.Sprintf("/WineReviews/Countries/Country/Region[@id=\"%s\"]/@region", wineReview.Wines[i].RegionId)
		result := xmlquery.FindOne(doc, xpathExpr)

		if result != nil {
			wineReview.Wines[i].RegionName = result.InnerText()
			// fmt.Printf("xpathExpr: %s\n", wineReview.Wines[i].RegionName)
		}
	}

	return &wineReview, nil
}
