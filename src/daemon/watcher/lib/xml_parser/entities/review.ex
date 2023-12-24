defmodule XmlParser.Entities.Review do
  @type t :: %__MODULE__{
          points: float(),
          twitter_handle: String.t(),
          wine_title: String.t(),
          description: String.t()
        }

  defstruct [:points, :twitter_handle, :wine_title, :description]
end
