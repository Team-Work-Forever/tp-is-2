import { Prisma } from "@prisma/client";

export type TasterOptions = Prisma.tasterGetPayload<{}>;

export function mapTasterToDto(taster: TasterOptions) {
    return {
        id: taster.id,
        name: taster.name,
        twitterHandle: taster.twitter_handle,
    };
}
