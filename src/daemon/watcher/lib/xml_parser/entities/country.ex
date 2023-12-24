defmodule XmlParser.Entities.Country do
  @type t :: %__MODULE__{
          name: String.t(),
          regions: [XmlParser.Entities.Region.t()]
        }

  defstruct [:name, :regions]
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
