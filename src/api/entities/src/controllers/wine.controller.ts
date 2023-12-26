import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { CreateWineRequest, UpdateWineRequest, updateWineSchema, wineSchema } from 'src/contracts/wine.requests';
import { ReviewDto } from 'src/contracts/dtos/review.dto';
import { WineDto } from 'src/contracts/dtos/wine.dto';
import { UuidPipe } from 'src/pipes/uuid.pipe';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { WineService } from 'src/services/wine.service';
import { title } from 'process';

@Controller('wines')
export class WineController {
    constructor(
        private readonly wineService: WineService
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
