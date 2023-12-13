import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { mapReviewToDto } from '../mappers/review.mapper';
import { mapWineToDto } from 'src/mappers/wine.mapper';
import { ReviewDto } from 'src/contracts/dtos/review.dto';

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

        return mapWineToDto(wine);
    }

    async findWineById(wineId: string) {
        const wine = await this.prisma.wine.findFirst({
            where: {
                id: wineId,
            },
            include: {
                region: true
            }
        })

        return mapWineToDto(wine);
    }

    async findAll() {
        const wines = await this.prisma.wine.findMany({ include: { region: true } });

        return wines.map(
            wine => mapWineToDto(wine));
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

        return mapWineToDto(wine);
    }

    async findByReviewIdByWineId(reviewId: string, wineId: string): Promise<ReviewDto> {
        const review = await this.prisma.review.findFirstOrThrow({
            where: {
                id: reviewId,
                wine_id: wineId,
            },
            include: {
                taster: true,
                wine: true,
            }
        });

        return mapReviewToDto(review);
    }

    async findReviewsByWineId(wineId: string): Promise<ReviewDto[]> {
        const reviews = await this.prisma.review.findMany({
            where: {
                wine_id: wineId
            },
            include: {
                taster: true,
                wine: true,
            }
        });

        return reviews.map(review => mapReviewToDto(review));
    }

}
