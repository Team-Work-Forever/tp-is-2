import os, asyncio
import uuid

from watchdog.events import FileSystemEventHandler
from watchdog.events import FileCreatedEvent

from utils.file_utils import calculate_checksum
from utils.csv_reader_utils import split_csv_file, get_temp_folder, clean_temp_folder

from xml_generation.standard_xml_converter import CSVtoXMLConverter

from data import CSVDataBaseRepository, XMLDataBaseRepository, UnitOfWork

class CSVHandler(FileSystemEventHandler):
    def __init__(self, input_path, output_path):
        self.csv_repository = CSVDataBaseRepository()
        self.xml_repository = XMLDataBaseRepository()
        self.unit_of_work = UnitOfWork()

        self._output_path = output_path
        self._input_path = input_path

        # generate file creation events for existing files
        for file in [os.path.join(dp, f) for dp, dn, filenames in os.walk(input_path) for f in filenames]:
            event = FileCreatedEvent(os.path.join(self._input_path, file))
            event.event_type = "created"
            self.dispatch(event)

    def __generate_unique_file_name(self, directory: str):

        # if not exists create the directory
        if not os.path.exists(directory):
            os.makedirs(directory)

        return f"{directory}/{str(uuid.uuid4())}.xml"

    def on_created(self, event):
        if not event.is_directory and event.src_path.endswith(".csv"):
            asyncio.run(self.convert_csv(event.src_path))

    def __convert_csv_to_xml(self, in_path, out_path):
        converter = CSVtoXMLConverter(in_path)

        xml_content = converter.to_xml_str()
        file = open(out_path, "w")
        file.write(xml_content)
        print(f"new xml file generated: '{file.name}'")
        file.close()

        return xml_content

    async def convert_csv(self, csv_path):
        checksum = calculate_checksum(csv_path)

        # check if the file was already submited
        if checksum in await self.csv_repository.get_already_converted_files():
            print("That file already exists in the database")
            return

        # split the file in multiple CSVs files
        # convert each file into XML name would be CSV_FILE_NAME-UUID.xml
        temp_folder_path = get_temp_folder(os.path.dirname(csv_path))
        splited_files = split_csv_file(csv_path, temp_folder_path)

        csv_file_name = os.path.basename(csv_path)
        distination = os.path.join(self._output_path, csv_file_name)

        # Iterate over the splited files and convert them to XML
        for splited_file in splited_files:
            xml_path = self.__generate_unique_file_name(distination)
            xml_content = self.__convert_csv_to_xml(splited_file, xml_path)

            self.xml_repository.save(xml_file_name=xml_path, xml_file_content=xml_content)

        # delete all temp files
        clean_temp_folder(temp_folder_path)

        # we store the main file onto the database
        self.csv_repository.save(csv_path=csv_path, destination_path=distination)
        self.unit_of_work.save_changes()
        print("CSV file converted to XML...")
