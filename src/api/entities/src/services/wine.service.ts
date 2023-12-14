import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { mapReviewToDto } from '../mappers/review.mapper';
import { mapWineToDto } from 'src/mappers/wine.mapper';
import { ReviewDto } from 'src/contracts/dtos/review.dto';
import { NotFoundError } from 'errors/not-found.error';
import { Prisma } from '@prisma/client';
import { UniqueConstraintError } from 'errors/unique-contraint.error';
import { ReviewService } from './review.service';
import { ConflitError } from 'errors/confilt.error';
import { CreateWineRequest } from 'src/contracts/wine.requests';

type CreateWine = CreateWineRequest;
type UpdateWine = CreateWineRequest & {
    wineId: string;
}

@Injectable()
export class WineService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly reviewService: ReviewService,
    ) { }

    async deleteWine(wineId: string) {
        await this.findWineById(wineId);

        const qtyReviews = await this.prisma.review.count({
            where: {
                wine_id: wineId,
                deleted_at: null,
            }
        });

        if (qtyReviews > 0) {
            throw new ConflitError("Cannot delete a wine with reviews, delete the reviews first");
        }

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

        if (!wine) {
            throw new NotFoundError("Wine not found");
        }

        return mapWineToDto(wine);
    }

    async findAll() {
        const wines = await this.prisma.wine.findMany({ include: { region: true } });

        return wines.map(
            wine => mapWineToDto(wine));
    }

    async create({ price, designation, variety, winery, region }: CreateWine) {
        try {
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
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new UniqueConstraintError("This wine already exists");
            }
        }
    }

    async update(request: UpdateWine) {
        await this.findWineById(request.wineId);

        const wine = await this.prisma.wine.update({
            where: {
                id: request.wineId,
            },
            data: {
                price: request.price,
                designation: request.designation,
                variety: request.variety,
                winery: request.winery,
            },
            include: {
                region: true
            }
        });

        return mapWineToDto(wine);
    }

    async findByReviewIdByWineId(reviewId: string, wineId: string): Promise<ReviewDto> {
        await this.findWineById(wineId);
        await this.reviewService.findByReviewId(reviewId);

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
        await this.findWineById(wineId);

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
