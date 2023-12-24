from data import DbConnection
from data.repositories.country_repository import CountryRepository
from data.repositories.taster_repository import TasterRepository
from data.repositories.wine_repository import WineRepository
from helpers import Env

Env.load()

DbConnection()

country_repository = WineRepository()
countreis = country_repository.get_all()