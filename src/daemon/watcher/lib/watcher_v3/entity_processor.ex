defmodule WatcherV3.EntityProcessor do
  require Logger

  @spec process_request(Redix.t(), AMQP.Channel.t(), String.t()) :: :ok
  def process_request(redis_connection, rabbitMq_channel, xml_id) do
    try do
      {:ok, payload} = Watcher.Services.Redis.get_value(redis_connection, xml_id)

      entities = XmlParser.Parser.parse(payload)
      process_entities(entities, rabbitMq_channel)

      # Update the imported_documents table
      Watcher.Services.ImportedDocuments.set_to_migrated(xml_id)

      :ok
    catch
      e ->
        Logger.error("Error processing request: #{inspect(e)}")
        Process.exit(self(), :kill)
    end
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

    :ok
  end

end
