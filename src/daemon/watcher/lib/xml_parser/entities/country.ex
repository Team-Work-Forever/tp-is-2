defmodule XmlParser.Entities.Country do
  alias XmlParser.Entities.Region

  @type t :: %__MODULE__{
          name: String.t(),
          regions: [Region.t()]
        }

  defstruct [:name, :regions]

  @spec get_regions_without_coordinates(t()) :: [Region.t()]
  def get_regions_without_coordinates(country) do
    Enum.filter(country.regions, fn region->
      region.lat == 0 or region.lon == 0
    end)
  end

  @spec get_region_by_id(t(), String.t()) :: Region.t() | nil
  def get_region_by_id(country, region_id) do
    Enum.find(country.regions, fn region ->
      region.id == region_id
    end)
  end

  @spec get_region_by_id_in_countries([t()], String.t()) :: Region.t() | nil
  def get_region_by_id_in_countries(countries, region_id) do
    Enum.reduce_while(countries, nil, fn country, _acc ->
      case get_region_by_id(country, region_id) do
        region when is_map(region) -> {:halt, region}
        nil -> {:cont, nil}
      end
    end)
  end
end


defmodule XmlParser.Entities.Region do
  @type t :: %__MODULE__{
          id: String.t(),
          name: String.t(),
          province: String.t(),
          lat: float(),
          lon: float()
        }

  defstruct [:id, :name, :province, :lat, :lon]
end
