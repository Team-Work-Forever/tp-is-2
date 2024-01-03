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
    wines = wine_from_xml(xml_string, countries)
    reviews = review_from_xml(xml_string, tasters, wines)

    countries ++ tasters ++ wines ++ reviews
  end

  @spec review_from_xml(String.t(), [Taster.t()], [Wine.t()]) :: [Review.t()]
  defp review_from_xml(xml_string, tasters, wines) do
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
        twitter_handle: Enum.find(tasters, fn taster ->
          taster.id == taster_id
        end).twitter_handle,
        points: points,
        wine_title: Enum.find(wines, fn wine ->
          wine.id == wine_id
        end).title,
        description: description
      }
    end)
  end

  @spec wine_from_xml(String.t(), [Country.t()]) :: [Wine.t()]
  defp wine_from_xml(xml_string, countries) do
    %{wines: wines} =
      SweetXml.xmap(xml_string,
        wines: [
          ~x"//Wine"l,
          id: ~x"@id"s,
          price: ~x"@price"f,
          designation: ~x"@designation"s,
          region_id: ~x"@region_id"s,
          variaty: ~x"@variaty"s,
          winery: ~x"@winery"s,
          title: ~x"@title"s
        ]
      )

    Enum.map(wines, fn
        %{
          id: id,
          price: price,
          designation: designation,
          region_id: region,
          variaty: variaty,
          winery: winery,
          title: title
        } ->
      %Wine{
        id: id,
        price: price,
        designation: designation,
        region: XmlParser.Entities.Country.get_region_by_id_in_countries(countries, region).name,
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
          id: ~x"@id"s,
          name: ~x"@name"s,
          twitter_handle: ~x"@twitter_handle"s
        ]
      )

    Enum.map(tasters, fn %{id: id, name: name, twitter_handle: twitter_handle} ->
      %Taster{id: id, name: name, twitter_handle: twitter_handle}
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
            id: ~x"@id"s,
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
          Enum.map(regions, fn %{id: id, region: region, province: province, lat: lat, lon: lon} ->
            %Region{id: id, name: region, province: province, lat: lat, lon: lon}
          end)
      }
    end)
  end
end
