import { Body, Controller, Delete, Get, Param, Post, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { CreateWineRequest, wineSchema } from 'src/contracts/create-wine.request';
import { ReviewDto } from 'src/contracts/dtos/review.dto';
import { WineDto } from 'src/contracts/dtos/wine.dto';
import { UuidPipe } from 'src/pipes/uuid.pipe';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { WineService } from 'src/services/wine.service';

@Controller('wines')
export class WineController {
    constructor(
        private readonly wineService: WineService
    ) { }

    @Post()
    @UsePipes(new ZodValidationPipe(wineSchema))
    public async createWine(@Body() request: CreateWineRequest, @Res() response: Response): Promise<Response<WineDto>> {
        const wine =
            await this.wineService.create(
                request.price,
                request.designation,
                request.variety,
                request.winery,
                request.region
            );

        return response
            .status(201).send(wine);
    }

    @Get()
    public async getWines(@Res() response: Response): Promise<Response<WineDto[]>> {
        const wines = await this.wineService.findAll();

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

    @Get(':wineId/reviews')
    public async getReviewsByWineId(@Param('wineId', new UuidPipe()) { id: wineId }, @Res() response: Response): Promise<Response<ReviewDto[]>> {
        const reviews = await this.wineService.findReviewsByWineId(wineId);

        return response
            .status(200).send(reviews);
    }

    @Get(':wineId/reviews/:reviewId')
    public async getReviewIdByWineId(
        @Param('wineId', new UuidPipe()) { id: wineId },
        @Param('reviewId', new UuidPipe()) { id: reviewId },
        @Res() response: Response): Promise<Response<ReviewDto>> {
        const reviews = await this.wineService.findByReviewIdByWineId(reviewId, wineId);

        return response
            .status(200).send(reviews);
    }
}
