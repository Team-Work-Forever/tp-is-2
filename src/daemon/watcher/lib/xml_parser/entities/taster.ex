defmodule XmlParser.Entities.Taster do
  @type t :: %__MODULE__{
          name: String.t(),
          twitter_handle: String.t()
        }

  defstruct [:name, :twitter_handle]
end
