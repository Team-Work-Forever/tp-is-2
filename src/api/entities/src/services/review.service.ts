import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ReviewDto } from 'src/contracts/dtos/review.dto';

@Injectable()
export class ReviewService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    public mapReviewToDto(review: any): ReviewDto {
        return {
            id: review.id,
            points: review.points,
            description: review.description,
            twitterHandle: review.taster.twitter_handle,
            wineId: review.wine.id,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            deletedAt: review.deletedAt,
        };
    }

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

        return this.mapReviewToDto(review);
    }

    async findAll(): Promise<ReviewDto[]> {
        const reviews = await this.prisma.review.findMany({
            include: {
                taster: true,
                wine: true,
            }
        });

        return reviews.map(review => this.mapReviewToDto(review));
    }

    async findByReviewId(reviewId: string): Promise<ReviewDto> {
        const review = await this.prisma.review.findFirstOrThrow({
            where: {
                id: reviewId,
            },
            include: {
                taster: true,
                wine: true,
            }
        });

        return this.mapReviewToDto(review);
    }

    async deleteReviewById(reviewId: string): Promise<ReviewDto> {
        const review = await this.prisma.review.delete({
            where: {
                id: reviewId,
            },
            include: {
                taster: true,
                wine: true,
            }
        });

        return this.mapReviewToDto(review);
    }
}
