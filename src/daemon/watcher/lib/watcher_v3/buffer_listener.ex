defmodule WatcherV3.BufferListener do
  use GenServer

  require Logger

  @channel "watch_channel"

  defmodule State do
    @type t :: %__MODULE__{
      buffer: map()
    }

    defstruct buffer: []
  end

  def start_link(_) do
    GenServer.start_link(__MODULE__, %State{buffer: []}, name: __MODULE__)
  end

  def init(_) do
    configure_notifier()

    {:ok, %State{buffer: []}}
  end

  @spec get_buffer_data(integer()) :: {list(), list()}
  def get_buffer_data(slice) do
    GenServer.call(__MODULE__, {:get_buffer_data, slice})
  end

  @spec configure_notifier() :: :ok | {:error, any()}
  defp configure_notifier() do
    repo_config = Watcher.Services.Repo.config()

    case Postgrex.Notifications.start_link(repo_config) do
      {:ok, pid} ->
        {:ok, _} = Postgrex.Notifications.listen(pid, @channel)
        :ok

      {:error, reason} ->
        Logger.error("Error configuring notifier: #{inspect(reason)}")
        {:error, reason}
    end
  end

  def handle_call({:get_buffer_data, slice}, _from, state) do
    new_buffer = Enum.slice(state.buffer, 0, slice)
    state = %State{buffer: Enum.drop(state.buffer, slice)}

    {:reply, {new_buffer, state.buffer}, state}
  end

  def handle_info({:notification, _pid, _ref, _channel, message}, state) do
    # Add message to buffer
    updated_buffer = state.buffer ++ [message]
    update_state = %State{buffer: updated_buffer}

    {:noreply, update_state}
  end

end
