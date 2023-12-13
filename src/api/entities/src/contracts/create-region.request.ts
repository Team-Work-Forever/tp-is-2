import { nameValidator } from "src/validation/name.validator";
import { z } from "zod";

export const regionSchema = z.object({
    name: nameValidator("Region Name"),
    province: nameValidator("Province"),
});

export type CreateRegionRequest = z.infer<typeof regionSchema>;