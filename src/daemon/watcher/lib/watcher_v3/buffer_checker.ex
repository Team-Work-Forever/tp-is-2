defmodule WatcherV3.BufferChecker do
  use GenServer

  require Logger

  @max_threads 20 # active threads
  @wait_for_secods 200 # in seconds

  defmodule ProcessBatch do
    @type t :: %__MODULE__{
      process_id: pid(),
      message: String.t()
    }

    defstruct process_id: nil, message: nil
  end

  defmodule State do
    @type t :: %__MODULE__{
      pids: list(ProcessBatch),
      active_threads: integer()
    }

    defstruct pids: [], active_threads: nil, redis: nil, rabbitmq: nil, already_processed: []
  end

  def start_link(_) do
    {:ok, redis_connection} = connect_to_redis()

    # Configure RabbitMq
    {:ok, rabbitMq_channel} = connect_to_rabbitMQ()

    # Start the GenServer
    GenServer.start_link(__MODULE__, %State{
        pids: [],
        active_threads: 0,
        redis: redis_connection,
        rabbitmq: rabbitMq_channel,
        already_processed: []
      }, name: __MODULE__)
  end

  def init(state) do
    schedule_periodic_check()

    {:ok, state}
  end

  @spec connect_to_redis() :: {:ok, Redix.t()}
  defp connect_to_redis do
    try do
      redis_connection = Watcher.Services.Redis.connect()
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
        Logger.error("Error connection to channel: #{inspect(e)}")
        Process.exit(self(), :kill)
    end
  end

  def handle_info(:check_array, state) do
    # Get Number of data in buffer, request only the number of threads, remove automaticly the goto data - v
    # Get buffer dispite the number of active threads being @active_threads the max number of threads - v
    number_of_retrived_data = @max_threads - state.active_threads
    {buffer_data, all_elements} = WatcherV3.BufferListener.get_buffer_data(number_of_retrived_data)

    IO.puts("\e[H\e[J"); IEx.dont_display_result
    IO.write("\rMax Threads: #{@max_threads} \n")
    IO.write("Active Threads: #{state.active_threads}  \n")
    IO.write("Next: #{length(buffer_data)}  \n")
    IO.write("Incoming Messages: #{length(all_elements)} \n")
    IO.write("Processed Messages: #{length(state.already_processed)} \n")

    # Verify which threads are still alive
    # Remove dead threads from state
    {updated_pids, dead_pids} =
        Enum.split_with(state.pids, fn pb ->
          Process.alive?(pb.process_id)
        end)

    # Spawn new threads
    new_pids =
      Enum.reduce(buffer_data, updated_pids, fn message, acc_pids ->
        {:ok, process_id} = Task.start_link(fn -> WatcherV3.EntityProcessor.process_request(
          state.redis,
          state.rabbitmq,
          message
        ) end)
        process_batch = %ProcessBatch{process_id: process_id, message: message}

        acc_pids ++ [process_batch]
      end)

    state = %State{state | pids: new_pids, active_threads: length(new_pids), already_processed: state.already_processed ++ dead_pids}

    # Replay buffer_data to threads
    schedule_periodic_check()
    {:noreply, state}
  end

  defp schedule_periodic_check do
    Process.send_after(self(), :check_array, @wait_for_secods)
  end
end
