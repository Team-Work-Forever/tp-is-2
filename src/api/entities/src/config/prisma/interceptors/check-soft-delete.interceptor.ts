import { Prisma } from "@prisma/client";

export const checkSoftDelete: Prisma.Middleware = async (params, next) => {
    if (params.model && params.action !== "create") {
        params.args.where = {
            ...params.args.where,
            deleted_at: null
        };
    }

    return next(params);
};
