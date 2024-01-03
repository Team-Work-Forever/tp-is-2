defmodule XmlParser.Entities.Taster do
  @type t :: %__MODULE__{
          id: String.t(),
          name: String.t(),
          twitter_handle: String.t()
        }

  defstruct [:id, :name, :twitter_handle]
end
