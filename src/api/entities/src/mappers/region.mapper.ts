import { Prisma } from "@prisma/client";
import { RegionDao } from "src/config/prisma/extensions/create-region.extension";

export type RegionOptions = Prisma.regionGetPayload<{}>;

export function mapRegionToDto(region: RegionOptions) {
    return {
        id: region.id,
        name: region.name,
        province: region.province,
        createdAt: region.created_at,
        updatedAt: region.updated_at,
    };
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