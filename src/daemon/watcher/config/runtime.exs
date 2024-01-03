import Dotenvy
import Config

source!([
  ".env",
  System.get_env()
])

config :watcher, Watcher.Services.Repo,
  database: env!("DB_DATABASE", :string!, "is"),
  username: env!("DB_USER", :string!, "is"),
  password: env!("DB_PASSWORD", :string!, "is"),
  hostname: env!("DB_HOST", :string!, "localhost"),
  port: env!("DB_PORT", :integer),
  types: Watcher.Types.PostgrexTypes

config :logger, level: :info
config :watcher, ecto_repos: [Watcher.Services.Repo]

config :watcher, :redis,
  host: env!("REDIS_HOST", :string!, "localhost"),
  port: env!("REDIS_PORT", :integer),
  db: env!("REDIS_DB", :integer),
  expire_at: 60 * 60 * 24 * 7

config :watcher, :rabbitmq,
  host: env!("RABBIT_MQ_HOST", :string!, "localhost"),
  port: env!("RABBIT_MQ_PORT", :integer),
  username: env!("RABBIT_MQ_USERNAME", :string!, "is"),
  password: env!("RABBIT_MQ_PASSWORD", :string!, "is"),
  virtual_host: env!("RABBIT_MQ_VIRTUAL_HOST", :string!, "is"),
  exchange: env!("RABBIT_MQ_EXCHANGE", :string!, "watcher"),
  queues: [
    {env!("RABBIT_MQ_QUEUE_ENTITIES", :string!, "entities"), env!("RABBIT_MQ_EXCHANGE", :string!, "watcher"), "create-country"},
    {env!("RABBIT_MQ_QUEUE_ENTITIES", :string!, "entities"), env!("RABBIT_MQ_EXCHANGE", :string!, "watcher"), "create-wine"},
    {env!("RABBIT_MQ_QUEUE_ENTITIES", :string!, "entities"), env!("RABBIT_MQ_EXCHANGE", :string!, "watcher"), "create-taster"},
    {env!("RABBIT_MQ_QUEUE_ENTITIES", :string!, "entities"), env!("RABBIT_MQ_EXCHANGE", :string!, "watcher"), "create-review"},
    {env!("RABBIT_MQ_QUEUE_POSTGIS", :string!, "postgis"), env!("RABBIT_MQ_EXCHANGE", :string!, "watcher"), "update-gis"}
  ]
