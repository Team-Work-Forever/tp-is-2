defmodule Watcher.Redis do
  alias Redix

  @redis_config Application.compile_env(:watcher, Watcher.Redis)

  @spec connect() :: {:ok, Redix.t()}
  def connect() do
    host = Keyword.get(@redis_config, :host)
    port = Keyword.get(@redis_config, :port)
    db = Keyword.get(@redis_config, :db)

    Redix.start_link("redis://#{host}:#{port}/#{db}")
  end

  @spec set_value(atom() | pid() | {atom(), any()} | {:via, atom(), any()}, any(), any()) ::
          {:error,
           atom()
           | %{
               :__exception__ => true,
               :__struct__ => Redix.ConnectionError | Redix.Error,
               optional(:message) => binary(),
               optional(:reason) => atom()
             }}
          | {:ok,
             nil
             | binary()
             | [nil | binary() | list() | integer() | Redix.Error.t()]
             | integer()
             | Redix.Error.t()}
  def set_value(redis_connection, key, value) do
    expire_at = Keyword.get(@redis_config, :expire_at)

    Redix.command(redis_connection, ["SET", key, value])
    Redix.command(redis_connection, ["EXPIRE", key, expire_at])
  end

  @spec remove_value(atom() | pid() | {atom(), any()} | {:via, atom(), any()}, any()) ::
          {:error,
           atom()
           | %{
               :__exception__ => true,
               :__struct__ => Redix.ConnectionError | Redix.Error,
               optional(:message) => binary(),
               optional(:reason) => atom()
             }}
          | {:ok,
             nil
             | binary()
             | [nil | binary() | list() | integer() | Redix.Error.t()]
             | integer()
             | Redix.Error.t()}
  def remove_value(redis_connection, key) do
    Redix.command(redis_connection, ["DEL", key])
  end

  @spec disconnect(Redix.t()) :: :ok
  def disconnect(redis_connection) do
    Redix.stop(redis_connection)
  end
end
