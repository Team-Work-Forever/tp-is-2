import { Injectable } from '@nestjs/common';
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

    async findAll(): Promise<ReviewDto[]> {
        const reviews = await this.prisma.review.findMany({
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
