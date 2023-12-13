import { Prisma } from "@prisma/client";

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