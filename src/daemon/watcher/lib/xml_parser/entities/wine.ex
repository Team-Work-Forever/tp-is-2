defmodule XmlParser.Entities.Wine do
  @type t :: %__MODULE__{
          price: String.t(),
          designation: String.t(),
          region: String.t(),
          variaty: String.t(),
          winery: String.t(),
          title: String.t()
        }

  defstruct [:price, :designation, :region, :variaty, :winery, :title]
end
