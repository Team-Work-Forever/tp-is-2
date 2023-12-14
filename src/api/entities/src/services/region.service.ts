import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'errors/not-found.error';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { mapRegionDaoToDto, mapRegionToDto } from 'src/mappers/region.mapper';
import { CountryService } from './country.service';
import { CreateRegionRequest } from 'src/contracts/create-region.request';
import createRegionExtension from 'src/config/prisma/extensions/create-region.extension';
import { ConflitError } from 'errors/confilt.error';

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
        const extendedPrisma = this.prisma.$extends(createRegionExtension);
        await this.countryService.findCountryById(countryId);

        const regions = await extendedPrisma.region.fetchManyByCountryId(countryId);

        return regions.map(region => mapRegionDaoToDto(region));
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
        const extendedPrisma = this.prisma.$extends(createRegionExtension);
        await this.findByRegionId(countryId, regionId);

        const qtyWines = await extendedPrisma.region.count({
            where: {
                id: regionId,
                wine: {
                    some: {
                        deleted_at: null
                    }
                }
            }
        });

        if (qtyWines > 0) {
            throw new ConflitError("It's not possible to remove a Region with Wines associated to it. Please remove the Wines first and try again.");
        }

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
