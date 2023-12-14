import { Prisma } from "@prisma/client";

export const applySoftDelete: Prisma.Middleware = async (params, next) => {
    if (isDeleteAction(params)) {
        params.action = "update";
        params.args.data = {
            deleted_at: new Date()
        };
    }

    return next(params);
};
function isDeleteAction(params: Prisma.MiddlewareParams) {
    return params.action === "delete" || params.action === "deleteMany";
}