import { RegionDto } from "./region.dto";

export interface CountryDto {
    id: string;
    name: string;
    regions: RegionDto[];
    createdAt: Date;
    updatedAt: Date;
}