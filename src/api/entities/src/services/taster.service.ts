import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NotFoundError } from 'errors/not-found.error';
import { UniqueConstraintError } from 'errors/unique-contraint.error';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { mapReviewToDto } from 'src/mappers/review.mapper';
import { mapTasterToDto } from 'src/mappers/taster.mapper';
import { ReviewService } from './review.service';
import { ConflitError } from 'errors/confilt.error';
import { UpdateTasterRequest } from 'src/contracts/taster.requests';

type UpdateTaster = UpdateTasterRequest & {
    tasterId: string
}

@Injectable()
export class TasterService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly reviewService: ReviewService,
    ) { }

    async deleteTaster(tasterId: string) {
        await this.findByTasterId(tasterId);

        const qtyReviews = await this.prisma.review.count({
            where: {
                taster_id: tasterId
            }
        });

        if (qtyReviews > 0) {
            throw new ConflitError("Cannot delete a taster with reviews, delete the reviews first");
        }

        const taster = await this.prisma.taster.delete({
            where: {
                id: tasterId,
            }
        });

        return mapTasterToDto(taster);
    }

    async findByTasterId(tasterId: string) {

        const taster = await this.prisma.taster.findFirst({
            where: {
                id: tasterId,
                deleted_at: null,
            }
        });

        if (!taster) {
            throw new NotFoundError("Taster not found")
        }

        return mapTasterToDto(taster);
    }

    async findAll() {
        const tasters = await this.prisma.taster.findMany({
            where: {
                deleted_at: null,
            }
        });

        return tasters.map(taster => mapTasterToDto(taster));
    }

    public async createTaster(name: string, twitterHandle: string) {
        try {
            const taster = await this.prisma.taster.create({
                data: {
                    name,
                    twitter_handle: twitterHandle,
                }
            });

            return mapTasterToDto(taster);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new UniqueConstraintError(`Taster by the name ${name} already exists`);
            }
        }
    }

    async update(taster: UpdateTaster) {
        await this.findByTasterId(taster.tasterId);

        const updatedTaster = await this.prisma.taster.update({
            where: {
                id: taster.tasterId
            },
            data: {
                name: taster.name,
                twitter_handle: taster.twitterHandle
            }
        })

        return updatedTaster;
    }

    async findReviewsByTasterId(tasterId: string) {
        await this.findByTasterId(tasterId);

        const reviews = await this.prisma.review.findMany({
            where: {
                taster_id: tasterId,
            },
            include: {
                taster: true,
                wine: true,
            }
        });

        return reviews.map(review => mapReviewToDto(review));
    }

    async findByReviewIdByTasterId(reviewId: string, tasterId: string) {
        await this.findByTasterId(tasterId);
        await this.reviewService.findByReviewId(reviewId);

        try {
            const review = await this.prisma.review.findFirstOrThrow({
                where: {
                    id: reviewId,
                    taster_id: tasterId,
                },
                include: {
                    taster: true,
                    wine: true,
                }
            });

            return mapReviewToDto(review);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientValidationError) {
                throw new NotFoundError("Review not found")
            }
        }
    }
}
