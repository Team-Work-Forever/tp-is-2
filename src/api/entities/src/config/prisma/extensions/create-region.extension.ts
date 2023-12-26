import { Prisma } from "@prisma/client";

export type CreateRegionDao = {
    name: string;
    province: string;
    country_id: string;
}

export type UpdateRegionDao = CreateRegionDao & {
    id: string;
}

export type RegionDao = {
    id: string;
    name: string;
    province: string;
    country: string;
    lat: number;
    lon: number;
    created_at: Date;
    updated_at: Date;
}

export default Prisma.defineExtension((prisma) => {
    return prisma.$extends({
        model: {
            region: {
                async update({
                    id,
                    name,
                    province,
                }: UpdateRegionDao) {
                    const context = Prisma.getExtensionContext(prisma);

                    await context.region.update({
                        data: {
                            name: name,
                            province: province,
                        },
                        include: 
                            {
                                country: true
                            },
                        where: {
                            id: id
                        }
                    })
                },
                async create({
                    name,
                    province,
                    country_id
                }: CreateRegionDao): Promise<RegionDao> {
                    const context = Prisma.getExtensionContext(prisma);

                    const response = await context.$queryRaw`
                        INSERT INTO "region" (name, province, country_id) VALUES (
                            ${name}, ${province}, ${country_id}::uuid)
                        returning id, created_at, updated_at;
                    `;

                    const country = await context.country.findFirst({
                        where: {
                            id: country_id
                        }
                    })

                    return {
                        id: response[0].id,
                        name,
                        province,
                        country: country?.name,
                        created_at: response[0].created_at,
                        updated_at: response[0].updated_at,
                    } as RegionDao;
                },
                async fetchRegionById(regionId: string): Promise<RegionDao | null> {
                    const context = Prisma.getExtensionContext(prisma);

                    const response = await context.$queryRaw`
                        SELECT 
                            id, 
                            name, 
                            province, 
                            ST_X(coordinates::geometry) as lat, 
                            ST_Y(coordinates::geometry) as lon, 
                            country_id as country, 
                            created_at, 
                            updated_at FROM "region" WHERE id = ${regionId}::uuid and deleted_at is null;
                    `;

                    return response[0] as RegionDao;
                },
                async fetchManyByCountryId(countryId: string): Promise<RegionDao[]> {
                    const context = Prisma.getExtensionContext(prisma);

                    const response = await context.$queryRaw`
                        SELECT 
                            id, 
                            name, 
                            province, 
                            ST_X(coordinates::geometry) as lat, 
                            ST_Y(coordinates::geometry) as lon, 
                            country_id as country, 
                            created_at, 
                            updated_at FROM "region" where country_id = ${countryId}::uuid and deleted_at is null;
                    `;

                    return response as RegionDao[];
                }
            }
        }
    })
});