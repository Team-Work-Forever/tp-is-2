import { nameValidator } from "src/validation/name.validator";
import { z } from "zod";

export const regionSchema = z
    .object({
        name: nameValidator("Name"),
        province: nameValidator("Province"),
        lat: z.number(),
        lon: z.number(),
    })
    .required();

export type CreateRegionRequest = z.infer<typeof regionSchema>;