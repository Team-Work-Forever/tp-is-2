defmodule Watcher.NotificationListener do
  require Logger
  use GenServer

  @channel "watch_channel"

  @spec start_link(any()) :: :ignore | {:error, any()} | {:ok, pid()}
  def start_link(init_args) do
    GenServer.start_link(__MODULE__, [init_args], name: __MODULE__)
  end

  @spec init(any()) :: {:ok, {AMQP.Channel.t(), Redix.t()}}
  @doc """
  Starts the listener and registers the channel to listen to.
  """
  def init(_) do
    # Configure Notification Listener
    configure_notifier()

    # Redis configuration
    {:ok, redis_connection} = connect_to_redis()

    # Configure RabbitMq
    {:ok, rabbitMq_channel} = connect_to_rabbitMQ()

    Logger.info("Watching started...")
    {:ok, {rabbitMq_channel, redis_connection}}
  end

  @spec configure_notifier() :: {:ok, pid()}
  defp configure_notifier() do
    repo_config = Watcher.Repo.config()

    {:ok, pid} = Postgrex.Notifications.start_link(repo_config)
    {:ok, _} = Postgrex.Notifications.listen(pid, @channel)
  end

  @spec connect_to_redis() :: {:ok, Redix.t()}
  defp connect_to_redis do
    try do
      redis_connection = Watcher.Redis.connect()
      redis_connection
    rescue
      e in Redix.Error ->
        Logger.error("Error connection to Redis: #{inspect(e)}")
        Process.exit(self(), :kill)
    catch
      e ->
        Logger.error("Something went wrong: #{inspect(e)}")
        Process.exit(self(), :kill)
    end
  end

  @spec connect_to_rabbitMQ() :: {:ok, AMQP.Channel.t()}
  defp connect_to_rabbitMQ do
    try do
      {:ok, rabbitMq_channel} = Watcher.Services.RabbitMQ.setup_connection()

      {:ok, rabbitMq_channel}
    catch
      e ->
        Logger.error("Error connection to channel #{@channel}: #{inspect(e)}")
        Process.exit(self(), :kill)
    end
  end

  defp process_entities([], _rabbitMq_channel) do
    :ok
  end

  @spec process_entities([any()], AMQP.Channel.t()) :: :ok
  defp process_entities(entities, rabbitMq_channel) do
    Enum.each(entities, fn entity ->
      case entity do
        %XmlParser.Entities.Country{} ->
          # Loop through all regions and publish to postgis queue
          regions = XmlParser.Entities.Country.get_regions_without_coordinates(entity)

          Enum.each(regions, fn region ->
            Watcher.Services.RabbitMQ.publish_message(rabbitMq_channel, "update-gis", %{
              country: entity.name,
              region: region.name
            })
          end)

          Watcher.Services.RabbitMQ.publish_message(rabbitMq_channel, "create-country", entity)

        %XmlParser.Entities.Taster{} ->
          Watcher.Services.RabbitMQ.publish_message(rabbitMq_channel, "create-taster", entity)

        %XmlParser.Entities.Wine{} ->
          Watcher.Services.RabbitMQ.publish_message(rabbitMq_channel, "create-wine", entity)

        %XmlParser.Entities.Review{} ->
          Watcher.Services.RabbitMQ.publish_message(rabbitMq_channel, "create-review", entity)

        _ ->
          Logger.error("Unknown entity: #{inspect(entity)}")
      end
    end)

    {:noreply, rabbitMq_channel}
  end

  def handle_info({:notification, _pid, _ref, @channel, payload}, state) do
    rabbitMq_channel = elem(state, 0)
    Logger.debug("Received a notification...")

    entities = XmlParser.Parser.parse(payload)
    process_entities(entities, rabbitMq_channel)

    {:noreply, state}
  end
end
