from watchdog.observers import Observer
from csv_event_handler import CSVHandler

class FileObserver(Observer):
    def __init__(self) -> None:
        self.observer = Observer()

    def schedule(self, input: str, ouput: str):
        print(f"Watching {input} for changes...")
        self.observer.schedule(CSVHandler(input_path=input, output_path=ouput), input, True)

    def start(self):
        self.observer.start()

    def stop(self):
        self.observer.stop()

    def join(self):
        self.observer.join()

__all__ = [
    'FileObserver', 
]