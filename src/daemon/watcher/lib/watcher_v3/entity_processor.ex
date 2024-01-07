defmodule WatcherV3.EntityProcessor do
  require Logger

  @spec process_request(Redix.t(), AMQP.Channel.t(), String.t()) :: :ok
  def process_request(redis_connection, rabbitMq_channel, xml_id) do
    try do
      # Get the payload from redis
      {:ok, payload} = Watcher.Services.Redis.get_value(redis_connection, xml_id)

      # entities = XmlParser.Parser.parse(payload)
      process_entities(payload, rabbitMq_channel)

      # Update the imported_documents table
      Watcher.Services.ImportedDocuments.set_to_migrated(xml_id)

      :ok
    catch
      e ->
        Logger.error("Error processing request: #{inspect(e)}")
        Process.exit(self(), :kill)
    end
  end

  @spec process_entities(any(), AMQP.Channel.t()) :: :ok
  defp process_entities(payload, rabbitMq_channel) do
    Watcher.Services.RabbitMQ.publish_message(rabbitMq_channel, "create-entity", payload)
    :ok
  end

end
