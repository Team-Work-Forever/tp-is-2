import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/errors/not-found.error';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { mapRegionDaoToDto, mapRegionToDto } from 'src/mappers/region.mapper';
import { CountryService } from './country.service';
import { CreateRegionRequest, UpdateRegionRequest } from 'src/contracts/region.requests';
import createRegionExtension from 'src/config/prisma/extensions/create-region.extension';
import { ConflitError } from 'src/errors/confilt.error';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import { BadRequestError } from 'src/errors/bad-request.error';

type CreateRegion = {
    request: CreateRegionRequest;
    countryId: string;
}

type UpdateRegion = UpdateRegionRequest & {
    countryId: string;
    regionId: string;
}


@Injectable()
export class RegionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly countryService: CountryService,
    ) { }

    async createRegion(data: CreateRegion) {
        await this.countryService.findCountryById(data.countryId);
        const extendedPrisma = this.prisma.$extends(createRegionExtension);

        return await Promise.all(data.request.map(async region => {
            try {
                const regionDAO = await extendedPrisma.region.create({
                    name: region.name,
                    province: region.province,
                    country_id: data.countryId
                })

                return mapRegionDaoToDto(regionDAO);
            } catch  (error) {
                if (error instanceof PrismaClientKnownRequestError) {
                    throw new ConflitError(`This region already exists on an country.`);
                }
            }
        }));

    }

    async updateRegion(request: UpdateRegion) {
        await this.countryService.findCountryById(request.countryId);
        const extendedPrisma = this.prisma.$extends(createRegionExtension);

        await extendedPrisma.region.update({
            id: request.regionId,
            name: request.name,
            province: request.province,
            country_id: request.countryId,
        });

        const region = await extendedPrisma
                            .region
                            .fetchRegionById(request.regionId);

        return mapRegionDaoToDto(region);
    }

    async findAll(
        countryId: string,
    ) {
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

        try {
            const region = await this.prisma.region.delete({
                where: {
                    id: regionId,
                    country: {
                        id: countryId,
                    }
                }
            });

            return mapRegionToDto(region);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                throw new NotFoundError("Region not found");
            }
        }

    }
}
