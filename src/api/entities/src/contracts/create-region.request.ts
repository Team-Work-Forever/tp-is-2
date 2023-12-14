import { nameValidator } from "src/validation/name.validator";
import { z } from "zod";

export const regionSchema = z
    .object({
        name: nameValidator("Name"),
        province: nameValidator("Province"),
        lat: z.number().min(-90).max(90),
        lon: z.number().min(-180).max(180),
    })
    .required();

export type CreateRegionRequest = z.infer<typeof regionSchema>;