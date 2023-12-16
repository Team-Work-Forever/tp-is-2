from data import db_access

class UnitOfWork():

    def __init__(self):
        self.db_access = db_access.DbConnection()

    def save_changes(self):
        self.db_access.commit()

    def roolback(self):
        self.db_access.roolback()