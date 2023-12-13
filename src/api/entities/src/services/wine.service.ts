import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { mapToWineDto } from 'src/mappers/wine.mapper';

@Injectable()
export class WineService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async deleteWine(wineId: string) {
        const wine = await this.prisma.wine.delete({
            where: {
                id: wineId
            },
            include: {
                region: true
            }
        })

        return mapToWineDto(wine);
    }

    async findWineById(wineId: string) {
        console.log(wineId);


        const wine = await this.prisma.wine.findFirst({
            where: {
                id: wineId,
            },
            include: {
                region: true
            }
        })

        return mapToWineDto(wine);
    }

    async findAll() {
        const wines = await this.prisma.wine.findMany({ include: { region: true } });

        return wines.map(
            wine => mapToWineDto(wine));
    }

    async create(price: number, designation: string, variety: string, winery: string, region: string) {
        const wine = await this.prisma.wine.create({
            data: {
                price: price,
                designation: designation,
                variety: variety,
                winery: winery,
                region: {
                    connect: {
                        name: region
                    }
                }
            },
            include: {
                region: true
            }
        });

        return mapToWineDto(wine);
    }
}
