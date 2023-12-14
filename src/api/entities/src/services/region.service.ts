import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'errors/not-found.error';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { mapRegionDaoToDto, mapRegionToDto } from 'src/mappers/region.mapper';
import { CountryService } from './country.service';
import { CreateRegionRequest } from 'src/contracts/create-region.request';
import { PrismaClient } from '@prisma/client';
import createRegionExtension from 'src/config/prisma/extensions/create-region.extension';

type CreateRegion = CreateRegionRequest & {
    countryId: string;
}

@Injectable()
export class RegionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly countryService: CountryService,
    ) { }

    async createRegion(request: CreateRegion) {
        await this.countryService.findCountryById(request.countryId);
        const extendedPrisma = this.prisma.$extends(createRegionExtension);

        try {
            const region = await extendedPrisma.region.create({
                name: request.name,
                province: request.province,
                lat: request.lat,
                lon: request.lon,
                country_id: request.countryId,
            });

            return mapRegionDaoToDto(region);
        } catch (error) {
        }
    }

    async findAll(countryId: string) {
        await this.countryService.findCountryById(countryId);

        const regions = await this.prisma.region.findMany({
            where: {
                country: {
                    id: countryId,
                }
            }
        });

        return regions.map(region => mapRegionToDto(region));
    }

    async findByRegionId(countryId: string, regionId: string) {
        await this.countryService.findCountryById(countryId);
        const extendedPrisma = this.prisma.$extends(createRegionExtension);

        const region = await extendedPrisma
            .region
            .fetchRegionById(regionId);

        if (!region) {
            throw new NotFoundError("Region not found");
        }

        return mapRegionDaoToDto(region);
    }

    async deleteRegionById(countryId: string, regionId: string) {
        await this.findByRegionId(countryId, regionId);

        const region = await this.prisma.region.delete({
            where: {
                id: regionId,
                country: {
                    id: countryId,
                }
            }
        });

        return mapRegionToDto(region);
    }
}
