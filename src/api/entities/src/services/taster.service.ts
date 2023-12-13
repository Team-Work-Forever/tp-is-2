import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class TasterService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    public mapTasterToDto(taster: any) {
        return {
            id: taster.id,
            name: taster.name,
            twitterHandle: taster.twitter_handle,
        };
    }

    async deleteTaster(tasterId: string) {
        const taster = await this.prisma.taster.delete({
            where: {
                id: tasterId,
            }
        });

        return this.mapTasterToDto(taster);
    }

    async findByTasterId(tasterId: string) {
        const taster = await this.prisma.taster.findFirstOrThrow({
            where: {
                id: tasterId,
            }
        });

        return this.mapTasterToDto(taster);
    }

    async findAll() {
        const tasters = await this.prisma.taster.findMany();

        return tasters.map(taster => this.mapTasterToDto(taster));
    }

    public async createTaster(name: string, twitterHandle: string) {
        const taster = await this.prisma.taster.create({
            data: {
                name,
                twitter_handle: twitterHandle,
            }
        });

        return this.mapTasterToDto(taster);
    }
}
