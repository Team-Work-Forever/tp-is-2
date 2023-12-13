import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { applySoftDelete } from './interceptors/apply-soft-delete.interceptor';
import { checkSoftDelete } from './interceptors/check-soft-delete.interceptor';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        // Connect to database
        await this.$connect();

        // Declare middlewares
        this.$use(applySoftDelete);
        this.$use(checkSoftDelete);
    }
}
