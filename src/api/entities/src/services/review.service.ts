import { BadRequestException, Injectable } from '@nestjs/common';
import { BadRequestError } from 'errors/bad-request.error';
import { NotFoundError } from 'errors/not-found.error';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ReviewDto } from 'src/contracts/dtos/review.dto';
import { UpdateReviewRequest } from 'src/contracts/review.requests';
import { mapReviewToDto } from 'src/mappers/review.mapper';

type UpdateReview = UpdateReviewRequest & {
    reviewId: string
}

@Injectable()
export class ReviewService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async createReview(points: number, description: string, twitterHandle: string, wineId: string): Promise<ReviewDto> {
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
        await this.findByReviewId(request.reviewId);

        const updatedReview = await this.prisma.review.update({
            where: {
                id: request.reviewId,
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

    async findAll({
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

    async findByReviewId(reviewId: string): Promise<ReviewDto> {
        const review = await this.prisma.review.findFirst({
            where: {
                id: reviewId,
            },
            include: {
                taster: true,
                wine: true,
            }
        });

        if (!review) {
            throw new NotFoundError(`Review with id ${reviewId} not found`);
        }

        return mapReviewToDto(review);
    }

    async deleteReviewById(reviewId: string): Promise<ReviewDto> {
        await this.findByReviewId(reviewId);

        const review = await this.prisma.review.delete({
            where: {
                id: reviewId,
            },
            include: {
                taster: true,
                wine: true,
            }
        });

        return mapReviewToDto(review);
    }
}
