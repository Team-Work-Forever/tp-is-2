import { BadRequestException, Injectable } from '@nestjs/common';
import { BadRequestError } from 'src/errors/bad-request.error';
import { NotFoundError } from 'src/errors/not-found.error';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ReviewDto } from 'src/contracts/dtos/review.dto';
import { UpdateReviewRequest } from 'src/contracts/review.requests';
import { mapReviewToDto } from 'src/mappers/review.mapper';

type UpdateReview = UpdateReviewRequest & {
    wineId: string
    reviewId: string
}

type ReviewRelation = {
    tasterId?: string
    wineId?: string
    reviewId: string
}

@Injectable()
export class ReviewService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(points: number, description: string, twitterHandle: string, wineId: string): Promise<ReviewDto> {
        // Verfiy that the taster exists
        const taster = await this.prisma.taster.findFirst({
            where: {
                twitter_handle: twitterHandle,
            }
        });

        if (!taster) {
            throw new NotFoundError(`Taster with twitter handle ${twitterHandle} not found`);
        }

        // Verfiy that the wine exists
        const wine = await this.prisma.wine.findFirst({
            where: {
                id: wineId,
            }
        });

        if (!wine) {
            throw new NotFoundError(`Wine with id ${wineId} not found`);
        }

        const review = await this.prisma.review.create({
            data: {
                points,
                description,
                taster: {
                    connect: {
                        twitter_handle: twitterHandle,
                    }
                },
                wine: {
                    connect: {
                        id: wineId,
                    }
                }
            },
            include: {
                taster: true,
                wine: true,
            }
        });

        return mapReviewToDto(review);
    }

    async update(request: UpdateReview) {
        await this.findById(request);

        const updatedReview = await this.prisma.review.update({
            where: {
                id: request.reviewId,
                wine_id: request.wineId,
            },
            data: {
                points: request.points,
                description: request.description,
            },
            include: {
                taster: true,
                wine: true
            }
        });

        return mapReviewToDto(updatedReview);
    }

    async findAllByWineId({
        wineId,
        gt_points,
        lt_points,
        eq_points,
        order = 'asc',
        page = 1,
        pageSize = 10,
    }: {
        wineId: string,
        gt_points?: string,
        lt_points?: string,
        eq_points?: string,
        order?: string,
        page?: number,
        pageSize?: number,
    }): Promise<ReviewDto[]> {
        if (order !== 'asc' && order !== 'desc') {
            throw new BadRequestError(`Order must be either asc or desc`);
        }

        const reviews = await this.prisma.review.findMany({
            where: {
                wine_id: wineId,
                points: {
                    gt: gt_points && parseInt(gt_points),
                    lt: lt_points && parseInt(lt_points),
                    equals: eq_points && parseInt(eq_points),
                },
            },
            orderBy: {
                points: order,
            },
            skip: (page - 1) * pageSize || 0,
            take: pageSize || 10,
            include: {
                taster: true,
                wine: true,
            }
        });

        return reviews.map(review => mapReviewToDto(review));
    }

    async findById(request: ReviewRelation): Promise<ReviewDto> {
        const review = await this.prisma.review.findFirst({
            where: {
                id: request.reviewId,
                wine_id: request.wineId,
                taster_id: request.tasterId,
            },
            include: {
                taster: true,
                wine: true,
            }
        });

        if (!review) {
            throw new NotFoundError(`Review with id ${request.reviewId} not found`);
        }

        return mapReviewToDto(review);
    }

    async deleleById(request: ReviewRelation): Promise<ReviewDto> {
        await this.findById(request);

        const review = await this.prisma.review.delete({
            where: {
                id: request.reviewId,
                wine_id: request.wineId,
            },
            include: {
                taster: true,
                wine: true,
            }
        });

        return mapReviewToDto(review);
    }

    async findAll({
        gt_points,
        lt_points,
        eq_points,
        order = 'asc',
        page = 1,
        pageSize = 10,
    }) {
        if (order !== 'asc' && order !== 'desc') {
            throw new BadRequestError(`Order must be either asc or desc`);
        }

        const totalReviews = await this.prisma.review.count({
            where: {
                points: {
                    gt: gt_points && parseInt(gt_points),
                    lt: lt_points && parseInt(lt_points),
                    equals: eq_points && parseInt(eq_points),
                },
            },
        });

        const reviews = await this.prisma.review.findMany({
            where: {
                points: {
                    gt: gt_points && parseInt(gt_points),
                    lt: lt_points && parseInt(lt_points),
                    equals: eq_points && parseInt(eq_points),
                },
            },
            skip: (page - 1) * pageSize || 0,
            take: pageSize || 10,
            include: {
                taster: true,
                wine: true,
            }
        });

        return {
            reviews: reviews.map(review => mapReviewToDto(review)),
            total: totalReviews
        }
    }
}
