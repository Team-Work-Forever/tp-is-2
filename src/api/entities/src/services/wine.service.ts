import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { WineDto } from 'src/contracts/dtos/wine.dto';

@Injectable()
export class WineService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    private mapToWineDto(wine: any): WineDto {
        return {
            id: wine.id,
            price: wine.price,
            designation: wine.designation,
            variety: wine.variety,
            winery: wine.winery,
            region: wine.region.name,
            createdAt: wine.created_at,
            updatedAt: wine.updated_at,
            deleteAt: wine.deleted_at
        } as WineDto;
    }

    async deleteWine(wineId: string) {
        const wine = await this.prisma.wine.delete({
            where: {
                id: wineId
            },
            include: {
                region: true
            }
        })

        return this.mapToWineDto(wine);
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

        return this.mapToWineDto(wine);
    }

    async findAll() {
        const wines = await this.prisma.wine.findMany({ include: { region: true } });

        return wines.map(
            wine => this.mapToWineDto(wine));
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

        return this.mapToWineDto(wine);
    }
}
