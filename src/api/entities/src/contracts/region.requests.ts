import { nameValidator } from "src/validation/name.validator";
import { z } from "zod";

export const regionSchema = z
    .object({
        name: nameValidator("Name").optional(),
        province: nameValidator("Province"),
        lat: z.number().min(-90).max(90),
        lon: z.number().min(-180).max(180),
    })
    .required();

export const regionSchemaArray = z.array(regionSchema);
export type CreateRegionRequest = z.infer<typeof regionSchemaArray>;

export const updateRegionSchema = z
    .object({
        name: nameValidator("Name").optional(),
        province: nameValidator("Province").optional(),
        lat: z.number().min(-90).max(90).optional(),
        lon: z.number().min(-180).max(180).optional(),
    })
    .refine(data =>
        data.name !== undefined ||
        data.province !== undefined ||
        data.lat !== undefined ||
        data.lon !== undefined,
        {
            message: 'At least one of the fields is required',
        });

export type UpdateRegionRequest = z.infer<typeof updateRegionSchema>;