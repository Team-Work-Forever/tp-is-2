import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NotFoundError } from 'errors/not-found.error';
import { UniqueConstraintError } from 'errors/unique-contraint.error';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CountryDto } from 'src/contracts/dtos/country.dto';
import { mapCountryToDto } from 'src/mappers/country.mapper';

@Injectable()
export class CountryService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async findCountryById(countryId: string) {
        const country = await this.prisma.country.findFirst({
            where: {
                id: countryId
            },
            include: {
                region: true,
            }
        });

        if (country === null) {
            throw new NotFoundError("Country not found");
        }

        return mapCountryToDto(country);
    }

    async create(name: string): Promise<CountryDto> {
        try {
            const country = await this.prisma.country.create({
                data: {
                    name
                },
                include: {
                    region: true,
                }
            });

            return mapCountryToDto(country);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new UniqueConstraintError("Country already exists");
            }
        }
    }

    async findAll() {
        const countries = await this.prisma.country.findMany({
            include: {
                region: true,
            }
        });

        return countries.map(country => {
            return mapCountryToDto(country);
        })
    }

    async deleteCountry(countryId: string): Promise<CountryDto> {
        await this.findCountryById(countryId);

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
