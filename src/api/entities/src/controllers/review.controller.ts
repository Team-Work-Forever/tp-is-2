import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { CreateReviewRequest, UpdateReviewRequest, reviewSchema, updateReviewSchema } from 'src/contracts/review.requests';
import { UuidPipe } from 'src/pipes/uuid.pipe';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { ReviewService } from 'src/services/review.service';

@Controller('wines/:wineId/reviews')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
    ) { }

    @Post()
    public async create(
        @Body(new ZodValidationPipe(reviewSchema)) request: CreateReviewRequest,
        @Param("wineId", new UuidPipe()) { id: wineId },
        @Res() response: Response) {
        const review = await this.reviewService.createReview(
            request.points,
            request.description,
            request.twitterHandle,
            wineId,
        );

        return response.status(HttpStatus.CREATED).json(review);
    }

    @Put(":reviewId")
    public async update(
        @Body(new ZodValidationPipe(updateReviewSchema)) request: UpdateReviewRequest,
        @Param("reviewId", new UuidPipe()) { id: reviewId },
        @Res() response: Response
    ) {
        const review = await this.reviewService.update({ ...request, reviewId });

        return response
            .status(HttpStatus.ACCEPTED).json(review);
    }

    @Get()
    public async findAll(
        @Query("page") page: string,
        @Query("pageSize") pageSize: string,
        @Query("gt_points") gt_points: string,
        @Query("lt_points") lt_points: string,
        @Query("eq_points") eq_points: string,
        @Query("order") order: string,
        @Param('wineId', new UuidPipe()) { id: wineId },
        @Res() response: Response
    ) {
        const reviews = await this.reviewService.findAll({
            wineId: wineId,
            order: order, 
            gt_points: gt_points,
            lt_points: lt_points,
            eq_points: eq_points,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
        });

        return response.status(HttpStatus.OK).json(reviews);
    }

    @Get(':reviewId')
    public async findByReviewId(@Param("reviewId", new UuidPipe()) { id: reviewId }, @Res() response: Response) {
        const review = await this.reviewService.findByReviewId(reviewId);

        return response.status(HttpStatus.OK).json(review);
    }

    @Delete(':reviewId')
    public async deleteByReviewId(@Param("reviewId", new UuidPipe()) { id: reviewId }, @Res() response: Response) {
        const review = await this.reviewService.deleteReviewById(reviewId);

        return response.status(HttpStatus.OK).json(review);
    }
}
