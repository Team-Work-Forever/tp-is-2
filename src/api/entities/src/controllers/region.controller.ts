import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { Response, response } from 'express';
import { CreateRegionRequest, regionSchema, regionSchemaArray, updateRegionSchema } from 'src/contracts/region.requests';
import { UuidPipe } from 'src/pipes/uuid.pipe';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { RegionService } from 'src/services/region.service';

@Controller('countries/:countryId/regions')
export class RegionController {
    constructor(
        private readonly regionService: RegionService,
    ) { }

    @Post()
    public async AddRegions(
        @Body(new ZodValidationPipe(regionSchemaArray)) request: CreateRegionRequest,
        @Param("countryId", new UuidPipe()) { id: countryId },
        @Res() response: Response) {
        const region = await this.regionService.createRegion({ request, countryId });

        return response
            .status(HttpStatus.CREATED).json(region);
    }

    @Put(":regionId")
    public async updateRegion(
        @Body(new ZodValidationPipe(updateRegionSchema)) request: CreateRegionRequest,
        @Param("countryId", new UuidPipe()) { id: countryId },
        @Param("regionId", new UuidPipe()) { id: regionId },
        @Res() response: Response) {

        const region = await this.regionService.updateRegion({ ...request, countryId, regionId });

        return response
            .status(HttpStatus.ACCEPTED).json(region);
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

        const regions = await this.regionService.findByRegionId(countryId, regionId);

        return response
            .status(HttpStatus.OK).json(regions);
    }

    @Delete(':regionId')
    public async deleteRegionById(
        @Param("countryId", new UuidPipe()) { id: countryId },
        @Param("regionId", new UuidPipe()) { id: regionId },
        @Res() response: Response) {
        const regions = await this.regionService.deleteRegionById(countryId, regionId);

        return response
            .status(HttpStatus.OK).json(regions);
    }

}
