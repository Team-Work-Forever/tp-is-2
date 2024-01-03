defmodule Watcher.Services.ConvertedDocuments do
  use Ecto.Schema

  schema "converted_documents" do
    field(:src, :string)
    field(:file_size, :integer)
    field(:dst, :string)
    field(:checksum, :string)
    field(:created_on, :utc_datetime_usec)
    field(:updated_on, :utc_datetime_usec)
  end
end
