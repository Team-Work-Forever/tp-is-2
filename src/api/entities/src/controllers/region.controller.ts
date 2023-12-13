import { Body, Controller, Delete, Get, Param, Post, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { CreateRegionRequest, regionSchema } from 'src/contracts/create-region.request';
import { UuidPipe } from 'src/pipes/uuid.pipe';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { RegionService } from 'src/services/region.service';

@Controller('countries/:countryId/regions')
export class RegionController {
    constructor(
        private readonly regionService: RegionService,
    ) { }

    @Post()
    @UsePipes(new ZodValidationPipe(regionSchema))
    public async createRegion(
        @Body() request: CreateRegionRequest,
        @Param("countryId", new UuidPipe()) { id: countryId },
        @Res() response: Response) {
        const regions = await this.regionService.createRegion(countryId);

        return response.status(201).json(regions);
    }

    @Get()
    public async getAllRegions(@Param("countryId", new UuidPipe()) { id: countryId }, @Res() response: Response) {
        const regions = await this.regionService.findAll(countryId);

        return response.status(200).json(regions);
    }

    @Get(':regionId')
    public async getRegionById(
        @Param("countryId", new UuidPipe()) { id: countryId },
        @Param("regionId", new UuidPipe()) { id: regionId },
        @Res() response: Response) {
        console.log(countryId, regionId);

        const regions = await this.regionService.findByRegionId(countryId, regionId);

        return response.status(200).json(regions);
    }

    @Delete(':regionId')
    public async deleteRegionById(
        @Param("countryId", new UuidPipe()) { id: countryId },
        @Param("regionId", new UuidPipe()) { id: regionId },
        @Res() response: Response) {
        const regions = await this.regionService.deleteRegionById(countryId, regionId);

        return response
            .status(200).json(regions);
    }

}
