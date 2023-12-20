import Config

config :watcher, Watcher.Repo,
  database: "is",
  username: "is",
  password: "is",
  hostname: "localhost",
  port: 10001

config :watcher, ecto_repos: [Watcher.Repo]

config :watcher, Watcher.RabbitMQ,
  host: "localhost",
  port: 5672,
  username: "is",
  password: "is",
  virtual_host: "is",
  exchange: "watcher",
  queue: "watcher",
  routing_key: "watcher"

config :watcher, Watcher.Redis,
  host: "localhost",
  port: 6379,
  db: 0,
  expire_at: 60 * 60 * 24 * 7
