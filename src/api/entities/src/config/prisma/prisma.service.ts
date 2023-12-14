import { Injectable, OnModuleInit } from '@nestjs/common';
import { applySoftDelete } from './interceptors/apply-soft-delete.interceptor';
import { checkSoftDelete } from './interceptors/check-soft-delete.interceptor';
import createRegionExtension, { RegionDao } from './extensions/create-region.extension';
import { PrismaClient } from '@prisma/client';

type PrismaClientWithExtensions = PrismaClient & {
    region: {
        createRegion: (region: RegionDao) => Promise<RegionDao>;
    };
}

@Injectable()
export class PrismaService extends (PrismaClient as { new(): PrismaClientWithExtensions }) implements OnModuleInit {
    async onModuleInit() {
        // Connect to the database
        await this.$connect();

        // Declare middlewares
        this.$use(applySoftDelete);
        this.$use(checkSoftDelete);
    }
}