import { Controller, Delete, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { UuidPipe } from 'src/pipes/uuid.pipe';
import { RegionService } from 'src/services/region.service';

@Controller('countries/:countryId/regions')
export class RegionController {
    constructor(
        private readonly regionService: RegionService,
    ) { }

    @Get()
    public async getAllRegions(@Param("countryId", new UuidPipe()) countryId: string, @Res() response: Response) {
        const regions = await this.regionService.findAll(countryId);

        return response.status(200).json(regions);
    }

    @Get(':regionId')
    public async getRegionById(
        @Param("countryId", new UuidPipe()) countryId: string,
        @Param("regionId", new UuidPipe()) regionId: string,
        @Res() response: Response) {
        const regions = await this.regionService.findByRegionId(countryId, regionId);

        return response.status(200).json(regions);
    }

    @Delete(':regionId')
    public async deleteRegionById(
        @Param("countryId", new UuidPipe()) countryId: string,
        @Param("regionId", new UuidPipe()) regionId: string,
        @Res() response: Response) {
        const regions = await this.regionService.deleteRegionById(countryId, regionId);

        return response.status(200).json(regions);
    }

}
