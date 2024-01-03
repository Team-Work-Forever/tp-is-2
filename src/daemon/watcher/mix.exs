defmodule Watcher.MixProject do
  use Mix.Project

  def project do
    [
      app: :watcher,
      version: "0.1.0",
      elixir: "~> 1.15",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger, :amqp],
      mod: {Watcher.Application, []}
    ]
  end

  defp deps do
    [
      {:ecto_sql, "~> 3.11"},
      {:postgrex, "~> 0.17.4"},
      {:amqp, "~> 3.3"},
      {:redix, "~> 1.3"},
      {:sweet_xml, "~> 0.7.4"},
      {:poison, "~> 5.0"}
    ]
  end
end
