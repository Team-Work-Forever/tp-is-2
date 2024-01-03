defmodule Watcher.Services.Redis do
  alias Redix

  @spec connect() :: {:ok, Redix.t()}
  def connect() do
    configuration = Application.fetch_env!(:watcher, :redis)

    host = Keyword.get(configuration, :host)
    port = Keyword.get(configuration, :port)
    db = Keyword.get(configuration, :db)

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
    configuration = Application.get_env(:watcher, Watcher.Services.Redis)
    expire_at = Keyword.get(configuration, :expire_at)

    Redix.command(redis_connection, ["SET", key, value])
    Redix.command(redis_connection, ["EXPIRE", key, expire_at])
  end

  @spec get_value(atom() | pid() | {atom(), any()} | {:via, atom(), any()}, any()) ::
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
  def get_value(redis_connection, key) do
    Redix.command(redis_connection, ["GET", key])
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
