import io
from csv import DictReader


class CSVReader:

    def __init__(self, path, delimiter=','):
        self._path = path
        self._delimiter = delimiter

    def loop(self):
        with open(self._path, 'r', encoding='utf-8') as file:
            for row in DictReader(file, delimiter=self._delimiter):
                yield row
        file.close()

    def read_entities(self, attr, builder, after_create=None):
        entities = {}
        for row in self.loop():
            e = '-'.join([row[at] for at in attr if at in row and row[at] != ''])

            if e not in entities:
                entities[e] = builder(row)
                after_create is not None and after_create(entities[e], row)

        return entities
