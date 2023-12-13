import { Controller, Delete, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { RegionService } from 'src/services/region.service';

@Controller('countries/:countryId/regions')
export class RegionController {
    constructor(
        private readonly regionService: RegionService,
    ) { }

    @Get()
    public async getAllRegions(@Param("countryId") countryId: string, @Res() response: Response) {
        const regions = await this.regionService.findAll(countryId);

        return response.status(200).json(regions);
    }

    @Get(':regionId')
    public async getRegionById(
        @Param("countryId") countryId: string,
        @Param("regionId") regionId: string,
        @Res() response: Response) {
        const regions = await this.regionService.findByRegionId(countryId, regionId);

        return response.status(200).json(regions);
    }

    @Delete(':regionId')
    public async deleteRegionById(
        @Param("countryId") countryId: string,
        @Param("regionId") regionId: string,
        @Res() response: Response) {
        const regions = await this.regionService.deleteRegionById(countryId, regionId);

        return response.status(200).json(regions);
    }

}
