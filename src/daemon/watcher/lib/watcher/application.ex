defmodule Watcher.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      Watcher.Repo,
      Watcher.NotificationListener
    ]

    opts = [strategy: :one_for_one, name: Watcher.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
