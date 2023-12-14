import { Prisma } from "@prisma/client";

export type CreateRegionDao = {
    name: string;
    province: string;
    lat: number;
    lon: number;
    country_id: string;
}

export type RegionDao = {
    id: string;
    name: string;
    province: string;
    lat: number;
    lon: number;
    country: string;
    created_at: Date;
    updated_at: Date;
}

export default Prisma.defineExtension((prisma) => {
    return prisma.$extends({
        model: {
            region: {
                async create({
                    name,
                    province,
                    lat,
                    lon,
                    country_id
                }: CreateRegionDao): Promise<RegionDao> {
                    const context = Prisma.getExtensionContext(prisma);
                    const point = `POINT(${lat} ${lon})`;

                    const response = await context.$queryRaw`
                        INSERT INTO "region" (name, province, coordinates, country_id) VALUES (
                            ${name}, ${province}, ST_GeomFromText(${point}, 4326), ${country_id}::uuid)
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
                        lat,
                        lon,
                        country: country?.name,
                        created_at: response[0].created_at,
                        updated_at: response[0].updated_at,
                    } as RegionDao;
                },
            }
        }
    })
});