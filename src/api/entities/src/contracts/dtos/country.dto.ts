import { RegionDto } from "../create-region.request";

export interface CountryDto {
    id: string;
    name: string;
    regions: RegionDto[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}