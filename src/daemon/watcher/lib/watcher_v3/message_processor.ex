defmodule WatcherV3.MessageProcessor do
  def process_messages(messages) do
    Enum.each(messages, &process_message/1)
  end

  # Function to process a single message
  def process_message(_message) do
    # Implement your logic to process the message with MessageProcessor
    # For example, you can send the message to the MessageProcessor service
    # and wait for the result.
    # You may want to handle errors and retries here.

    # IO.puts("Processing message: #{inspect(message)}")

    # Simulate processing time
    random_delay_seconds = :rand.uniform(5) + 1
    :timer.sleep(random_delay_seconds * 1000)

    # Once processing is done, you can update the state or take other actions
    # IO.puts("\nMessage processed: #{inspect(message)}")
  end
end
