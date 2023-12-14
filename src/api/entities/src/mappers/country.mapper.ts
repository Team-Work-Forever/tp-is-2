import { Prisma } from "@prisma/client";
import { CountryDto } from "src/contracts/dtos/country.dto";
import { mapRegionDaoToDto, mapRegionToDto } from "./region.mapper";
import { RegionDto } from "src/contracts/dtos/region.dto";
import { RegionDao } from "src/config/prisma/extensions/create-region.extension";

export type CountryOptions = Prisma.countryGetPayload<{
    include: {
        region: true;
    }
}>;

export function mapCountryToDto(country: CountryOptions, regions?: RegionDao[]): CountryDto {
    return {
        id: country.id,
        name: country.name,
        regions: regions ? mapRegionDaos(regions) : mapRegions(country.region),
        createdAt: country.created_at,
        updatedAt: country.updated_at,
    }
}

function mapRegions(region: Prisma.regionGetPayload<{}>[]): RegionDto[] {
    return region.map(region => mapRegionToDto(region));
}

function mapRegionDaos(region: RegionDao[]): RegionDto[] {
    return region.map(region => mapRegionDaoToDto(region));
}