import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'errors/not-found.error';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { mapRegionToDto } from 'src/mappers/region.mapper';
import { CountryService } from './country.service';

@Injectable()
export class RegionService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly countryService: CountryService,
    ) { }

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

        const region = await this.prisma.region.findFirst({
            where: {
                id: regionId,
                country: {
                    id: countryId,
                }
            }
        });

        if (!region) {
            throw new NotFoundError("Region not found");
        }

        return mapRegionToDto(region);
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
