import { nameValidator } from "src/validation/name.validator";
import { z } from "zod";

export const regionSchema = z
    .object({
        name: nameValidator("Name").optional(),
        province: nameValidator("Province"),
    })
    .required();

export const regionSchemaArray = z.array(regionSchema);
export type CreateRegionRequest = z.infer<typeof regionSchemaArray>;

export const updateRegionSchema = z
    .object({
        name: nameValidator("Name").optional(),
        province: nameValidator("Province").optional(),
    })
    .refine(data =>
        data.name !== undefined ||
        data.province !== undefined ||
        {
            message: 'At least one of the fields is required',
        });

export type UpdateRegionRequest = z.infer<typeof updateRegionSchema>;