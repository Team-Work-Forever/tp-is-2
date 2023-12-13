import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { CreateReviewRequest, reviewSchema } from 'src/contracts/create-review.request';
import { UuidPipe } from 'src/pipes/uuid.pipe';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { ReviewService } from 'src/services/review.service';

@Controller('reviews')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
    ) { }

    @Post()
    @UsePipes(new ZodValidationPipe(reviewSchema))
    public async create(@Body() request: CreateReviewRequest, @Res() response: Response) {
        const review = await this.reviewService.createReview(
            request.points,
            request.description,
            request.twitterHandle,
            request.wineId,
        );

        return response.status(HttpStatus.CREATED).json(review);
    }

    @Get()
    public async findAll(@Res() response: Response) {
        const reviews = await this.reviewService.findAll();

        return response.status(HttpStatus.OK).json(reviews);
    }

    @Get(':reviewId')
    public async findByReviewId(@Param("reviewId", new UuidPipe()) reviewId: string, @Res() response: Response) {
        const review = await this.reviewService.findByReviewId(reviewId);

        return response.status(HttpStatus.OK).json(review);
    }

    @Delete(':reviewId')
    public async deleteByReviewId(@Param("reviewId", new UuidPipe()) reviewId: string, @Res() response: Response) {
        const review = await this.reviewService.deleteReviewById(reviewId);

        return response.status(HttpStatus.OK).json(review);
    }
}
