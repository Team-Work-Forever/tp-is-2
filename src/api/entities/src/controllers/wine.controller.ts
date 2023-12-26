import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { CreateWineRequest, UpdateWineRequest, updateWineSchema, wineSchema } from 'src/contracts/wine.requests';
import { WineDto } from 'src/contracts/dtos/wine.dto';
import { UuidPipe } from 'src/pipes/uuid.pipe';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { WineService } from 'src/services/wine.service';
import { CreateReviewRequest, UpdateReviewRequest, reviewSchema, updateReviewSchema } from 'src/contracts/review.requests';
import { ReviewService } from 'src/services/review.service';

@Controller('wines')
export class WineController {
    constructor(
        private readonly wineService: WineService,
        private readonly reviewService: ReviewService
    ) { }

    @Post()
    @UsePipes(new ZodValidationPipe(wineSchema))
    public async createWine(@Body() request: CreateWineRequest, @Res() response: Response): Promise<Response<WineDto>> {
        const wine =
            await this.wineService.create({ ...request });

        return response
            .status(201).send(wine);
    }

    @Put(":wineId")
    public async updateWine(
        @Body(new ZodValidationPipe(updateWineSchema)) request: UpdateWineRequest,
        @Param("wineId", new UuidPipe()) { id: wineId },
        @Res() response: Response): Promise<Response<WineDto>> {
        const wine =
            await this.wineService.update({ ...request, wineId });

        return response
            .status(200).send(wine);
    }

    @Get()
    public async getWines(
        @Query("title") title: string,
        @Res() response: Response): Promise<Response<WineDto[]>> {
        const wines = await this.wineService.findAll(title);

        return response
            .status(200).send(wines);
    }

    @Get(":wineId")
    public async getWineById(@Param("wineId", new UuidPipe()) { id: wineId }, @Res() response: Response): Promise<Response<WineDto>> {
        const wine = await this.wineService.findWineById(wineId);

        return response
            .status(200).send(wine);
    }

    @Delete(":wineId")
    public async deleteWineById(@Param("wineId", new UuidPipe()) { id: wineId }, @Res() response: Response) {
        const wine = await this.wineService.deleteWine(wineId);

        return response
            .status(200).send(wine);
    }

    @Get(":wineId/reviews")
    public async findAllReviews(
        @Query("page") page: string,
        @Query("pageSize") pageSize: string,
        @Query("gt_points") gt_points: string,
        @Query("lt_points") lt_points: string,
        @Query("eq_points") eq_points: string,
        @Query("order") order: string,
        @Param('wineId', new UuidPipe()) { id: wineId },
        @Res() response: Response
    ) {
        const reviews = await this.reviewService.findAllByWineId({
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

    @Get(':wineId/reviews/:reviewId')
    public async findByReviewId(
        @Param("wineId", new UuidPipe()) { id: wineId }, 
        @Param("reviewId", new UuidPipe()) { id: reviewId }, 
        @Res() response: Response
    ) {
        const review = await this.reviewService.findById(reviewId);

        return response.status(HttpStatus.OK).json(review);
    }

    @Delete(':wineId/reviews/:reviewId')
    public async deleteByReviewId(
        @Param("wineId", new UuidPipe()) { id: wineId },
        @Param("reviewId", new UuidPipe()) { id: reviewId }, 
        @Res() response: Response
    ) {
        const review = await this.reviewService.deleleById({wineId, reviewId});

        return response.status(HttpStatus.OK).json(review);
    }

    @Post(":wineId/reviews")
    public async create(
        @Body(new ZodValidationPipe(reviewSchema)) request: CreateReviewRequest,
        @Param("wineId", new UuidPipe()) { id: wineId },
        @Res() response: Response) {
        const review = await this.reviewService.create(
            request.points,
            request.description,
            request.twitterHandle,
            wineId,
        );

        return response.status(HttpStatus.CREATED).json(review);
    }

    @Put(":wineId/reviews/:reviewId")
    public async update(
        @Body(new ZodValidationPipe(updateReviewSchema)) request: UpdateReviewRequest,
        @Param("wineId", new UuidPipe()) { id: wineId },
        @Param("reviewId", new UuidPipe()) { id: reviewId },
        @Res() response: Response
    ) {
        const review = await this.reviewService.update({ ...request, wineId, reviewId });

        return response
            .status(HttpStatus.ACCEPTED).json(review);
    }
}
