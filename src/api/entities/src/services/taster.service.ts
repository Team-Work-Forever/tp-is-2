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
import { BadRequestError } from 'errors/bad-request.error';

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

    async findAll(name?: string, twitterHandle?: string) {
        const tasters = await this.prisma.taster.findMany({
            where: {
                name: {
                    equals: name,
                },
                twitter_handle: {
                    equals: twitterHandle,
                },
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

        return mapTasterToDto(updatedTaster);
    }

    async findReviewsByTasterId({
        tasterId,
        gt_points,
        lt_points,
        eq_points,
        order = 'asc',
        page = 1,
        pageSize = 10,
    }: {
        tasterId: string,
        gt_points?: string,
        lt_points?: string,
        eq_points?: string,
        order?: string,
        page?: number,
        pageSize?: number,
    }) {
        await this.findByTasterId(tasterId);

        if (order !== 'asc' && order !== 'desc') {
            throw new BadRequestError(`Order must be either asc or desc`);
        }

        const reviews = await this.prisma.review.findMany({
            where: {
                taster_id: tasterId,
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

        return reviews.map(review => mapReviewToDto(review));
    }

    async findByReviewIdByTasterId(reviewId: string, tasterId: string) {
        await this.findByTasterId(tasterId);
        await this.reviewService.findById({ reviewId, tasterId });

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
