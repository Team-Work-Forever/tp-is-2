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
          Enum.each(entity.regions, fn region ->
            Watcher.Services.RabbitMQ.publish_message(rabbitMq_channel, "update-gis", %{
              name: region.name,
              lat: region.lat,
              lng: region.lon
            })

            # Logger.debug("Publishing postgis coordinates: #{inspect(region)}")
          end)

          Watcher.Services.RabbitMQ.publish_message(rabbitMq_channel, "create-country", entity)

        # Logger.debug("Publishing country: #{inspect(entity)}")

        %XmlParser.Entities.Taster{} ->
          Watcher.Services.RabbitMQ.publish_message(rabbitMq_channel, "create-taster", entity)

        # Logger.debug("Publishing taster: #{inspect(entity)}")

        %XmlParser.Entities.Wine{} ->
          Watcher.Services.RabbitMQ.publish_message(rabbitMq_channel, "create-wine", entity)

        # Logger.debug("Publishing wine: #{inspect(entity)}")

        %XmlParser.Entities.Review{} ->
          Watcher.Services.RabbitMQ.publish_message(rabbitMq_channel, "create-review", entity)

        # Logger.debug("Publishing review: #{inspect(entity)}")

        _ ->
          Logger.error("Unknown entity: #{inspect(entity)}")
      end
    end)

    {:noreply, rabbitMq_channel}
  end

  def handle_info({:notification, _pid, _ref, @channel, payload}, state) do
    rabbitMq_channel = elem(state, 0)
    # redis_connection = elem(state, 1)

    Logger.debug("Received a notification...")

    # Publish on Redis new xml
    # process_id = Ecto.UUID.generate()

    # case Watcher.Redis.set_value(redis_connection, "#{process_id}", payload) do
    #   {:ok, _} ->
    #     Logger.debug("Published on Redis: #{process_id}")

    #   {:error, reason} ->
    #     Logger.error("Error publishing on Redis: #{reason}")
    #     {:noreply, state}
    # end

    entities = XmlParser.Parser.parse(payload)
    process_entities(entities, rabbitMq_channel)

    # # Publish on RabbitMQ
    # case Watcher.RabbitMQ.publish_message(rabbitMq_channel, "#{process_id}") do
    #   :ok ->
    #     Logger.debug("Published on RabbitMQ: #{process_id}")

    #   {:error, reason} ->
    #     Logger.error("Error publishing on RabbitMQ: #{reason}")

    #     # Remove from Redis
    #     case Watcher.Redis.remove_value(redis_connection, "#{process_id}") do
    #       {:ok, _} ->
    #         Logger.debug("Removed from Redis: #{process_id}")

    #       {:error, reason} ->
    #         Logger.error("Error removing from Redis: #{reason}")
    #         {:noreply, state}
    #     end

    #     {:noreply, state}
    # end

    {:noreply, state}
  end
end