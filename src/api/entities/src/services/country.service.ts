import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NotFoundError } from 'errors/not-found.error';
import { UniqueConstraintError } from 'errors/unique-contraint.error';
import createRegionExtension from 'src/config/prisma/extensions/create-region.extension';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateCountryRequest } from 'src/contracts/create-country.request';
import { CountryDto } from 'src/contracts/dtos/country.dto';
import { RegionDto } from 'src/contracts/dtos/region.dto';
import { mapCountryToDto } from 'src/mappers/country.mapper';

@Injectable()
export class CountryService {
    constructor(
        private readonly prisma: PrismaService,
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

    async create(request: CreateCountryRequest): Promise<CountryDto> {
        const extendedPrismas = this.prisma.$extends(createRegionExtension);

        try {
            const country = await extendedPrismas.country.create({
                data: {
                    name: request.name
                },
                include: {
                    region: true,
                }
            });

            const regions = await Promise.all(request.regions?.map(async region => {
                return await extendedPrismas.region.create({
                    name: region.name,
                    province: region.province,
                    lat: region.lat,
                    lon: region.lon,
                    country_id: country.id
                })
            }));

            return mapCountryToDto(country, regions);
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
