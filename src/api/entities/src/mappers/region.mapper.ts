import { Prisma } from "@prisma/client";
import { RegionDao } from "src/config/prisma/extensions/create-region.extension";
import { RegionDto } from "src/contracts/dtos/region.dto";

export type RegionOptions = Prisma.regionGetPayload<{}>;

export function mapRegionToDto(region: RegionOptions) {
    return {
        id: region.id,
        name: region.name,
        province: region.province,
        lat: 1,
        lon: 0,
        createdAt: region.created_at,
        updatedAt: region.updated_at,
    } as RegionDto;
}

export function mapRegionDaoToDto(region: RegionDao) {
    return {
        id: region.id,
        name: region.name,
        province: region.province,
        lat: region.lat,
        lon: region.lon,
        createdAt: region.created_at,
        updatedAt: region.updated_at,
    };
}