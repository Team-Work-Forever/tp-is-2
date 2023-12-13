import { Body, Controller, Delete, Get, Param, Post, Res, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { CreateCountryRequest, countrySchema } from 'src/contracts/create-country.request';
import { CountryDto } from 'src/contracts/dtos/country.dto';
import { UuidPipe } from 'src/pipes/uuid.pipe';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { CountryService } from 'src/services/country.service';

@Controller('countries')
export class CountryController {
    constructor(
        private readonly countryService: CountryService
    ) { }

    @Post()
    @UsePipes(new ZodValidationPipe(countrySchema))
    public async createCountry(@Body() request: CreateCountryRequest, @Res() response: Response): Promise<Response<CountryDto>> {
        const country = await this.countryService.create(request.name);

        return response
            .status(201).send(country);
    }

    @Get()
    public async getCountries(@Res() response: Response) {
        const countries = await this.countryService.findAll();

        return response
            .status(200).send(countries);
    }

    @Get(":countryId")
    public async getCountryById(@Param("countryId", new UuidPipe()) { id: countryId }, @Res() response: Response) {
        const country = await this.countryService.findCountryById(countryId);

        return response
            .status(200).send(country);
    }

    @Delete(":countryId")
    public async deleteCountryById(@Param("countryId", new UuidPipe()) { id: countryId }, @Res() response: Response) {
        const country = await this.countryService.deleteCountry(countryId);

        return response
            .status(200).send(country);
    }
}
