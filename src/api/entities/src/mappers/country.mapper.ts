import { Prisma } from "@prisma/client";
import { CountryDto } from "src/contracts/dtos/country.dto";
import { mapRegionToDto } from "./region.mapper";
import { RegionDto } from "src/contracts/create-region.request";

export type CountryOptions = Prisma.countryGetPayload<{
    include: {
        region: true;
    }
}>;

export function mapCountryToDto(country: CountryOptions): CountryDto {
    return {
        id: country.id,
        name: country.name,
        regions: mapRegions(country.region),
        createdAt: country.created_at,
        updatedAt: country.updated_at,
        deletedAt: country.deleted_at,
    }
}

function mapRegions(region: Prisma.regionGetPayload<{}>[]): RegionDto[] {
    return region.map(region => mapRegionToDto(region));
}