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
end


defmodule XmlParser.Entities.Region do
  @type t :: %__MODULE__{
          name: String.t(),
          province: String.t(),
          lat: float(),
          lon: float()
        }

  defstruct [:name, :province, :lat, :lon]
end
