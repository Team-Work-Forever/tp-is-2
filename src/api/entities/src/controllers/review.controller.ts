import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateReviewRequest } from 'src/contracts/create-review.request';
import { ReviewService } from 'src/services/review.service';

@Controller('reviews')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
    ) { }

    @Post()
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
    public async findByReviewId(@Param("reviewId") reviewId: string, @Res() response: Response) {
        const review = await this.reviewService.findByReviewId(reviewId);

        return response.status(HttpStatus.OK).json(review);
    }

    @Delete(':reviewId')
    public async deleteByReviewId(@Param("reviewId") reviewId: string, @Res() response: Response) {
        const review = await this.reviewService.deleteReviewById(reviewId);

        return response.status(HttpStatus.OK).json(review);
    }
}
