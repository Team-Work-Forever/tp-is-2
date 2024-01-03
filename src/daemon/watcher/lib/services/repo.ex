
defmodule Watcher.Services.Repo do
  use Ecto.Repo,
    otp_app: :watcher,
    adapter: Ecto.Adapters.Postgres
  end
