defmodule Watcher.Services.ImportedDocuments do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :integer, autogenerate: false}

  schema "imported_documents" do
    field(:file_name, :string)
    field(:xml, :string)
    field(:migrated_on, :utc_datetime_usec)
    field(:created_on, :utc_datetime_usec)
    field(:updated_on, :utc_datetime_usec)
    field(:deleted_on, :utc_datetime_usec)
  end

  def set_to_migrated(id) do
    case Watcher.Services.Repo.get_by(Watcher.Services.ImportedDocuments, id: Integer.parse(id) |> (&elem(&1, 0)).()) do
      nil ->
        {:error, "Record not found"}

      existing_record ->
        existing_record
        |> changeset(%{migrated_on: DateTime.utc_now()})
        |> Watcher.Services.Repo.update!()
    end
  end

  def changeset(imported_document, attrs) do
    imported_document
    |> cast(attrs, [:file_name, :xml, :migrated_on, :created_on, :updated_on, :deleted_on])
  end
end
