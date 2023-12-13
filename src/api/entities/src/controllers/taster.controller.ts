import { Body, Controller, Delete, Get, Param, Post, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { CreateTasterRequest, tasterSchema } from 'src/contracts/create-taster.request';
import { ReviewDto } from 'src/contracts/dtos/review.dto';
import { TasterDto } from 'src/contracts/dtos/taster.dto';
import { UuidPipe } from 'src/pipes/uuid.pipe';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { TasterService } from 'src/services/taster.service';

@Controller('tasters')
export class TasterController {
    constructor(
        private readonly tasterService: TasterService,
    ) { }

    @Post()
    @UsePipes(new ZodValidationPipe(tasterSchema))
    public async createTaster(@Body() request: CreateTasterRequest, @Res() response: Response): Promise<Response<TasterDto>> {
        const taster = await this.tasterService
            .createTaster(request.name, request.twitterHandle);

        return response
            .status(200).send(taster);
    }

    @Get()
    public async getAllTasters(@Res() response: Response): Promise<Response<TasterDto[]>> {
        const tasters = await this.tasterService
            .findAll();

        return response
            .status(200).send(tasters);
    }

    @Get(':tasterId')
    public async getTasterById(@Param('tasterId', new UuidPipe()) { id: tasterId }, @Res() response: Response): Promise<Response<TasterDto>> {
        const taster = await this.tasterService
            .findByTasterId(tasterId);

        return response
            .status(200).send(taster);
    }

    @Delete(':tasterId')
    public async deleteTasterId(@Param('tasterId', new UuidPipe()) { id: tasterId }, @Res() response: Response): Promise<Response<TasterDto>> {
        const taster = await this.tasterService
            .deleteTaster(tasterId);

        return response
            .status(200).send(taster);
    }

    @Get(':tasterId/reviews')
    public async getReviewsByTasterId(@Param('tasterId', new UuidPipe()) { id: tasterId }, @Res() response: Response): Promise<Response<ReviewDto[]>> {
        const reviews = await this.tasterService.findReviewsByTasterId(tasterId);

        return response
            .status(200).send(reviews);
    }

    @Get(':tasterId/reviews/:reviewId')
    public async getReviewIdByTasterId(
        @Param('tasterId', new UuidPipe()) { id: tasterId },
        @Param('reviewId', new UuidPipe()) { id: reviewId },
        @Res() response: Response): Promise<Response<ReviewDto>> {
        const reviews = await this.tasterService.findByReviewIdByTasterId(reviewId, tasterId);

        return response
            .status(200).send(reviews);
    }
}
