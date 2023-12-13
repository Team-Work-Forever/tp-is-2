import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateTasterRequest } from 'src/contracts/create-taster.request';
import { ReviewDto } from 'src/contracts/dtos/review.dto';
import { TasterDto } from 'src/contracts/dtos/taster.dto';
import { TasterService } from 'src/services/taster.service';

@Controller('tasters')
export class TasterController {
    constructor(
        private readonly tasterService: TasterService,
    ) { }

    @Post()
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
    public async getTasterById(@Param('tasterId') tasterId: string, @Res() response: Response): Promise<Response<TasterDto>> {
        const taster = await this.tasterService
            .findByTasterId(tasterId);

        return response
            .status(200).send(taster);
    }

    @Delete(':tasterId')
    public async deleteTasterId(@Param('tasterId') tasterId: string, @Res() response: Response): Promise<Response<TasterDto>> {
        const taster = await this.tasterService
            .findByTasterId(tasterId);

        return response
            .status(200).send(taster);
    }

    @Get(':tasterId/reviews')
    public async getReviewsByTasterId(@Param('tasterId') tasterId: string, @Res() response: Response): Promise<Response<ReviewDto>> {
        const reviews = await this.tasterService.findReviewsByTasterId(tasterId);

        return response
            .status(200).send(reviews);
    }
