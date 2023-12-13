import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { mapReviewToDto } from 'src/mappers/review.mapper';
import { mapTasterToDto } from 'src/mappers/taster.mapper';

@Injectable()
export class TasterService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async deleteTaster(tasterId: string) {
        const taster = await this.prisma.taster.delete({
            where: {
                id: tasterId,
            }
        });

        return mapTasterToDto(taster);
    }

    async findByTasterId(tasterId: string) {
        const taster = await this.prisma.taster.findFirstOrThrow({
            where: {
                id: tasterId,
            }
        });

        return mapTasterToDto(taster);
    }

    async findAll() {
        const tasters = await this.prisma.taster.findMany();

        return tasters.map(taster => mapTasterToDto(taster));
    }

    public async createTaster(name: string, twitterHandle: string) {
        const taster = await this.prisma.taster.create({
            data: {
                name,
                twitter_handle: twitterHandle,
            }
        });

        return mapTasterToDto(taster);
    }

    async findReviewsByTasterId(tasterId: string) {
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
    }
}
