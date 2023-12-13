import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'errors/not-found.error';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ReviewDto } from 'src/contracts/dtos/review.dto';
import { mapReviewToDto } from 'src/mappers/review.mapper';

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
