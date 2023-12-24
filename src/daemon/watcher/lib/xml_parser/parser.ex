defmodule XmlParser.Parser do
  alias XmlParser.Entities.Taster
  alias XmlParser.Entities.Country
  alias XmlParser.Entities.Region
  alias XmlParser.Entities.Wine
  alias XmlParser.Entities.Review

  require Logger

  import SweetXml, only: [sigil_x: 2]

  @spec parse(String.t()) :: [Country.t() | Taster.t() | Wine.t() | Review.t()]
  def parse(xml_string) do
    countries = country_from_xml(xml_string)
    tasters = taster_from_xml(xml_string)
    wines = wine_from_xml(xml_string)
    reviews = review_from_xml(xml_string)

    countries ++ tasters ++ wines ++ reviews
  end

  @spec review_from_xml(String.t()) :: [Review.t()]
  defp review_from_xml(xml_string) do
    %{reviews: reviews} =
      SweetXml.xmap(xml_string,
        reviews: [
          ~x"//Review"l,
          points: ~x"@points"i,
          taster_id: ~x"@taster_id"s,
          wine_id: ~x"@wine_id"s,
          description: ~x"./ReviewDescription/text()"s
        ]
      )

    Enum.map(reviews, fn %{
                           points: points,
                           taster_id: taster_id,
                           wine_id: wine_id,
                           description: description
                         } ->
      %Review{
        twitter_handle:
          to_string(
            SweetXml.xpath(xml_string, ~x"//Taster[@id=\"#{taster_id}\"]/@twitter_handle")
          ),
        points: points,
        wine_title: to_string(SweetXml.xpath(xml_string, ~x"//Wine[@id=\"#{wine_id}\"]/@title")),
        description: description
      }
    end)
  end

  @spec wine_from_xml(String.t()) :: [Wine.t()]
  defp wine_from_xml(xml_string) do
    %{wines: wines} =
      SweetXml.xmap(xml_string,
        wines: [
          ~x"//Wine"l,
          price: ~x"@price"f,
          designation: ~x"@designation"s,
          region: ~x"@region_id"s,
          variaty: ~x"@variaty"s,
          winery: ~x"@winery"s,
          title: ~x"@title"s
        ]
      )

    Enum.map(wines, fn %{
                         price: price,
                         designation: designation,
                         region: region,
                         variaty: variaty,
                         winery: winery,
                         title: title
                       } ->
      %Wine{
        price: price,
        designation: designation,
        region: to_string(SweetXml.xpath(xml_string, ~x"//Region[@id=\"#{region}\"]/@region")),
        variaty: variaty,
        winery: winery,
        title: title
      }
    end)
  end

  @spec taster_from_xml(String.t()) :: [Taster.t()]
  defp taster_from_xml(xml_string) do
    %{tasters: tasters} =
      SweetXml.xmap(xml_string,
        tasters: [
          ~x"//Taster"l,
          name: ~x"@name"s,
          twitter_handle: ~x"@twitter_handle"s
        ]
      )

    Enum.map(tasters, fn %{name: name, twitter_handle: twitter_handle} ->
      %Taster{name: name, twitter_handle: twitter_handle}
    end)
  end

  @spec country_from_xml(String.t()) :: [Country.t()]
  defp country_from_xml(xml_string) do
    %{countries: countries} =
      SweetXml.xmap(xml_string,
        countries: [
          ~x"//Country"l,
          name: ~x"@name"s,
          regions: [
            ~x"./Region"l,
            region: ~x"@region"s,
            province: ~x"@province"s,
            lat: ~x"@lat"f,
            lon: ~x"@lon"f
          ]
        ]
      )

    Enum.map(countries, fn %{name: name, regions: regions} ->
      %Country{
        name: name,
        regions:
          Enum.map(regions, fn %{region: region, province: province, lat: lat, lon: lon} ->
            %Region{name: region, province: province, lat: lat, lon: lon}
          end)
      }
    end)
  end
end
