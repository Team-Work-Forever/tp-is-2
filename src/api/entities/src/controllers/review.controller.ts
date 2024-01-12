import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReviewService } from 'src/services/review.service';

@Controller('reviews')
export class ReviewController {
    constructor(
        private readonly reviewService: ReviewService,
    ) { }

    @Get()
    public async getReviews(
        @Query("page") page: string,
        @Query("pageSize") pageSize: string,
        @Query("gt_points") gt_points: string,
        @Query("lt_points") lt_points: string,
        @Query("eq_points") eq_points: string,
        @Query("order") order: string,
        @Res() response: Response): Promise<Response<any>> {
        const { reviews, total } = await this.reviewService.findAll({
            order: order, 
            gt_points: gt_points,
            lt_points: lt_points,
            eq_points: eq_points,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
        });

        return response
            .status(200).send(
                {
                    data: reviews,
                    page: page,
                    pageSize: pageSize,
                    totalPages: Math.ceil(total / parseInt(pageSize)),
                }
            );
    }

}
