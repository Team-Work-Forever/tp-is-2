import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class RegionService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    private mapRegionToDto(region: any) {
        return {
            id: region.id,
            name: region.name,
            province: region.province,
            createdAt: region.createdAt,
            updatedAt: region.updatedAt,
            deletedAt: region.deletedAt,
        };
    }

    async findAll(countryId: string) {
        const regions = await this.prisma.region.findMany({
            where: {
                country: {
                    id: countryId,
                }
            }
        });

        return regions.map(region => this.mapRegionToDto(region));
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

        return this.mapRegionToDto(region);
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

        return this.mapRegionToDto(region);
    }
}
