defmodule Watcher.RabbitMQ do
  alias AMQP.Connection
  alias AMQP.Channel
  alias AMQP.Queue
  alias AMQP.Exchange
  alias AMQP.Basic

  @rabbit_config Application.compile_env(:watcher, Watcher.RabbitMQ)

  @spec setup_connection() :: {:ok, AMQP.Channel.t()}
  def setup_connection() do
    try do
      rabbitmq_url = build_rabbitmq_url()

      {:ok, connection} = Connection.open(rabbitmq_url)
      {:ok, channel} = Channel.open(connection)

      create_and_bind_queue(channel)

      {:ok, channel}
    catch
      exception ->
        IO.puts("Unexpected error in setup_connection: #{inspect(exception)}")
        Process.exit(self(), :kill)
    end
  end

  @spec build_rabbitmq_url() :: String.t()
  defp build_rabbitmq_url() do
    host = Keyword.get(@rabbit_config, :host)
    port = Keyword.get(@rabbit_config, :port)
    username = Keyword.get(@rabbit_config, :username)
    password = Keyword.get(@rabbit_config, :password)
    virtual_host = Keyword.get(@rabbit_config, :virtual_host)

    "amqp://#{username}:#{password}@#{host}:#{port}/#{virtual_host}"
  end

  @spec create_and_bind_queue(AMQP.Channel.t()) :: :ok
  defp create_and_bind_queue(channel) do
    exchange = Keyword.get(@rabbit_config, :exchange)
    queue = Keyword.get(@rabbit_config, :queue)
    routing_key = Keyword.get(@rabbit_config, :routing_key)

    Queue.declare(channel, queue)
    Exchange.declare(channel, exchange)
    Queue.bind(channel, queue, exchange, routing_key: routing_key)
  end

  @spec publish_message(AMQP.Channel.t(), binary()) :: :ok | {:error, :blocked | :closing}
  def publish_message(channel, message) do
    exchange = Keyword.get(@rabbit_config, :exchange)
    queue = Keyword.get(@rabbit_config, :queue)

    Basic.publish(channel, queue, exchange, message)
  end

  @spec close_connection(AMQP.Channel.t()) :: :ok | {:error, {:error, :blocked | :closing}}
  def close_connection(channel) do
    Channel.close(channel)
  end
end
