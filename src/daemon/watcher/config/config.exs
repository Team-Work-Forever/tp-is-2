import Config

config :watcher, Watcher.Repo,
  database: "is",
  username: "is",
  password: "is",
  hostname: "localhost",
  port: 10001

config :watcher, ecto_repos: [Watcher.Repo]

config :watcher, Watcher.Redis,
  host: "localhost",
  port: 6379,
  db: 0,
  expire_at: 60 * 60 * 24 * 7

config :watcher, Watcher.Services.RabbitMQ,
  host: "localhost",
  port: 5672,
  username: "is",
  password: "is",
  virtual_host: "is",
  exchange: "watcher",
  queues: [
    {"entities", "watcher", "create-country"},
    {"entities", "watcher", "create-wine"},
    {"entities", "watcher", "create-taster"},
    {"entities", "watcher", "create-review"},
    {"postgis", "watcher", "update-gis"}
  ]
