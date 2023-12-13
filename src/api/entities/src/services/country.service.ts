import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CountryDto } from 'src/contracts/dtos/country.dto';

@Injectable()
export class CountryService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    mapCountryToDto(country: any) {
        return this.mapCountryToDto(country);
    }

    async findAll() {
        const countries = await this.prisma.country.findMany();

        return countries.map(country => {
            this.mapCountryToDto(country);
        })
    }

    async findCountryById(countryId: string) {
        const country = await this.prisma.country.findFirst({
            where: {
                id: {
                    equals: countryId
                }
            }
        });

        return this.mapCountryToDto(country);
    }

    async create(name: string) {
        const country = await this.prisma.country.create({
            data: {
                name
            }
        });

        return this.mapCountryToDto(country);
    }

    async deleteCountry(countryId: string) {
        const country = await this.prisma.country.delete({
            where: {
                id: countryId
            }
        });

        return this.mapCountryToDto(country);
    }

}
