Postgrex.Types.define(
  Watcher.Types.PostgrexTypes,
  [Watcher.Types.PostgrexXML] ++ Ecto.Adapters.Postgres.extensions()
)
