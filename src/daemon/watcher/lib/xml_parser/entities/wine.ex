defmodule XmlParser.Entities.Wine do
  @type t :: %__MODULE__{
          id: String.t(),
          price: String.t(),
          designation: String.t(),
          region: String.t(),
          variaty: String.t(),
          winery: String.t(),
          title: String.t()
        }

  defstruct [:id, :price, :designation, :region, :variaty, :winery, :title]
end
