import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateWineRequest } from 'src/contracts/create-wine.request';
import { WineDto } from 'src/contracts/dtos/wine.dto';
import { WineService } from 'src/services/wine.service';

@Controller('wines')
export class WineController {
    constructor(
        private readonly wineService: WineService
    ) { }

    @Post()
    public async createWine(@Body() request: CreateWineRequest, @Res() response: Response): Promise<Response<WineDto>> {
        console.log(request);

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
    public async getWineById(@Param("wineId") wineId: string, @Res() response: Response): Promise<Response<WineDto>> {
        const wine = await this.wineService.findWineById(wineId);

        return response
            .status(200).send(wine);
    }

    @Delete(":wineId")
    public async deleteWineById(@Param("wineId") wineId: string, @Res() response: Response) {
        const wine = await this.wineService.deleteWine(wineId);

        return response
            .status(200).send(wine);
    }
}
