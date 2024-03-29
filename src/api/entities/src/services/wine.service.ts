import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { mapReviewToDto } from '../mappers/review.mapper';
import { mapWineToDto } from 'src/mappers/wine.mapper';
import { ReviewDto } from 'src/contracts/dtos/review.dto';
import { NotFoundError } from 'src/errors/not-found.error';
import { Prisma } from '@prisma/client';
import { UniqueConstraintError } from 'src/errors/unique-contraint.error';
import { ReviewService } from './review.service';
import { ConflitError } from 'src/errors/confilt.error';
import { CreateWineRequest } from 'src/contracts/wine.requests';
import { BadRequestError } from 'src/errors/bad-request.error';

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

    async findAll({
        title,
        gt_price,
        lt_price,
        eq_price,
        order = 'asc',
        page = 1,
        pageSize = 10
    }) {
        if (order !== 'asc' && order !== 'desc') {
            throw new BadRequestError(`Order must be either asc or desc`);
        }

        const totalWines = await this.prisma.wine.count({
            where: {
              title: {
                equals: title,
              },
            },
          });

        const wines = await this.prisma.wine.findMany({
            where: {
                title: {
                    equals: title,
                },
                price: {
                    gt: gt_price && parseInt(gt_price),
                    lt: lt_price && parseInt(lt_price),
                    equals: eq_price && parseInt(eq_price),
                },
            },
            skip: (page - 1) * pageSize || 0,
            take: pageSize || 10,
            include: { region: true }
        });

        return {
            wines: wines.map(
                wine => mapWineToDto(wine)),
            total: totalWines
        }
    }

    async create({ price, designation, variety, winery, title, region }: CreateWine) {
        // verify if region exists
        const regionFound = await this.prisma.region.findFirst({
            where: {
                name: region,
            }
        });

        if (!regionFound) {
            throw new NotFoundError("Region not found");
        }

        try {
            const wine = await this.prisma.wine.create({
                data: {
                    price: price,
                    designation: designation,
                    variety: variety,
                    winery: winery,
                    title: title,
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
                throw new UniqueConstraintError(error.message);
            }
        }
    }

    async update(request: UpdateWine) {
        await this.findWineById(request.wineId);

        const regionFound = await this.prisma.region.findFirst({
            where: {
                name: request.region,
            }
        });

        if (!regionFound) {
            throw new NotFoundError("Region not found");
        }


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
        await this.reviewService.findById({ reviewId, wineId });

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
