import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { ReviewDto } from 'src/contracts/dtos/review.dto';
import { TasterDto } from 'src/contracts/dtos/taster.dto';
import { CreateTasterRequest, UpdateTasterRequest, tasterSchema, updateTasterSchema } from 'src/contracts/taster.requests';
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
            .status(HttpStatus.CREATED).send(taster);
    }

    @Put(":tasterId")
    public async updateTaster(
        @Body(new ZodValidationPipe(updateTasterSchema)) request: UpdateTasterRequest,
        @Param("tasterId", new UuidPipe()) { id: tasterId },
        @Res() response: Response
    ) {
        const result = await this.tasterService.update({ ...request, tasterId });
        
        return response
            .status(HttpStatus.ACCEPTED).send(result);
    }

    @Get()
    public async getAllTasters(
        @Query('name') name: string,
        @Query('twitter_handle') twitterHandle: string,
        @Res() response: Response): Promise<Response<TasterDto[]>> {
        const tasters = await this.tasterService
            .findAll(name, twitterHandle);

        return response
            .status(HttpStatus.OK).send(tasters);
    }

    @Get(':tasterId')
    public async getTasterById(@Param('tasterId', new UuidPipe()) { id: tasterId }, @Res() response: Response): Promise<Response<TasterDto>> {
        const taster = await this.tasterService
            .findByTasterId(tasterId);

        return response
            .status(HttpStatus.OK).send(taster);
    }

    @Delete(':tasterId')
    public async deleteTasterId(@Param('tasterId', new UuidPipe()) { id: tasterId }, @Res() response: Response): Promise<Response<TasterDto>> {
        const taster = await this.tasterService
            .deleteTaster(tasterId);

        return response
            .status(HttpStatus.OK).send(taster);
    }

    @Get(':tasterId/reviews')
    public async getReviewsByTasterId(
        @Query("page") page: string,
        @Query("pageSize") pageSize: string,
        @Query("gt_points") gt_points: string,
        @Query("lt_points") lt_points: string,
        @Query("eq_points") eq_points: string,
        @Query("order") order: string,
        @Param('tasterId', new UuidPipe()) { id: tasterId }, 
        @Res() response: Response
    ): Promise<Response<ReviewDto[]>> {
        const reviews = await this.tasterService.findReviewsByTasterId({
            tasterId,
            order: order, 
            gt_points: gt_points,
            lt_points: lt_points,
            eq_points: eq_points,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
        });

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
