import { Prisma } from "@prisma/client";
import { WineDto } from "src/contracts/dtos/wine.dto";

export type WineOptions = Prisma.wineGetPayload<{
    include: {
        region: true;
    }
}>;

export function mapWineToDto(wine: WineOptions): WineDto {
    return {
        id: wine.id,
        price: wine.price,
        designation: wine.designation,
        variety: wine.variety,
        winery: wine.winery,
        region: wine.region.name,
        createdAt: wine.created_at,
        updatedAt: wine.updated_at,
        deleteAt: wine.deleted_at
    } as WineDto;
}
