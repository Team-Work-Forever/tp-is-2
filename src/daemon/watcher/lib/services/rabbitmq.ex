defmodule Watcher.Services.RabbitMQ do
  alias AMQP.Connection
  alias AMQP.Channel
  alias AMQP.Queue
  alias AMQP.Exchange
  alias AMQP.Basic

  require Logger

  @spec setup_connection() :: {:ok, AMQP.Channel.t()}
  def setup_connection() do
    try do
      rabbitmq_url = build_rabbitmq_url()

      {:ok, connection} = Connection.open(rabbitmq_url)
      {:ok, channel} = Channel.open(connection)

      create_and_bind_queue(channel)

      {:ok, channel}
    catch
      _exception ->
        Process.exit(self(), :kill)
    end
  end

  @spec build_rabbitmq_url() :: String.t()
  defp build_rabbitmq_url() do
    config = Application.fetch_env!(:watcher, :rabbitmq)

    host = Keyword.get(config, :host)
    port = Keyword.get(config, :port)
    username = Keyword.get(config, :username)
    password = Keyword.get(config, :password)
    virtual_host = Keyword.get(config, :virtual_host)

    "amqp://#{username}:#{password}@#{host}:#{port}/#{virtual_host}"
  end

  @spec create_and_bind_queue(AMQP.Channel.t()) :: :ok
  defp create_and_bind_queue(channel) do
    config = Application.fetch_env!(:watcher, :rabbitmq)
    queues = Keyword.get(config, :queues)

    Enum.each(queues, fn {queue, exchange, routing_key} ->
      Queue.declare(channel, queue)
      Exchange.declare(channel, exchange)
      Queue.bind(channel, queue, exchange, routing_key: routing_key)
    end)
  end

  @spec publish_message(AMQP.Channel.t(), String.t(), any()) ::
          :ok | {:error, :blocked | :closing}
  def publish_message(channel, router_key, message) do
    config = Application.fetch_env!(:watcher, :rabbitmq)
    exchange = Keyword.get(config, :exchange)

    Basic.publish(channel, exchange, router_key, message)
  end

  @spec close_connection(AMQP.Channel.t()) :: :ok | {:error, {:error, :blocked | :closing}}
  def close_connection(channel) do
    Channel.close(channel)
  end
end
