import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReviewService } from 'src/services/review.service';

@Controller('reviews')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
    ) { }

    @Get()
    public async getReviews(@Res() response: Response): Promise<Response<any>> {
        const reviews = await this.reviewService.findAll();

        return response
            .status(200).send(reviews);
    }

}
