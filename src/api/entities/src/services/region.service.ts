import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { mapRegionToDto } from 'src/mappers/region.mapper';

@Injectable()
export class RegionService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(countryId: string) {
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
        console.log(countryId, regionId);


        const region = await this.prisma.region.findFirstOrThrow({
            where: {
                id: regionId,
                country: {
                    id: countryId,
                }
            }
        });

        return mapRegionToDto(region);
    }

    async deleteRegionById(countryId: string, regionId: string) {
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
