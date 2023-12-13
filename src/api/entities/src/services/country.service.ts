import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CountryDto } from 'src/contracts/dtos/country.dto';
import { mapCountryToDto } from 'src/mappers/country.mapper';

@Injectable()
export class CountryService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async findAll() {
        const countries = await this.prisma.country.findMany({
            include: {
                region: true,
            }
        });

        return countries.map(country => {
            mapCountryToDto(country);
        })
    }

    async findCountryById(countryId: string) {
        const country = await this.prisma.country.findFirst({
            where: {
                id: {
                    equals: countryId
                }
            },
            include: {
                region: true,
            }
        });

        return mapCountryToDto(country);
    }

    async create(name: string): Promise<CountryDto> {
        const country = await this.prisma.country.create({
            data: {
                name
            },
            include: {
                region: true,
            }
        });

        return mapCountryToDto(country);
    }

    async deleteCountry(countryId: string): Promise<CountryDto> {
        const country = await this.prisma.country.delete({
            where: {
                id: countryId
            },
            include: {
                region: true,
            }
        });

        return mapCountryToDto(country);
    }

}
