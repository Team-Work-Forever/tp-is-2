import { nameValidator } from 'src/validation/name.validator';
import { numberValidator } from 'src/validation/number.valitor';
import { textValidator } from 'src/validation/text.validator';
import { z } from 'zod';

export const wineSchema = z
    .object({
        price: numberValidator("Price"),
        designation: textValidator("Designation"),
        variety: nameValidator("Variety"),
        winery: z.string(),
        region: nameValidator("Region"),
        title: textValidator("Title"),
    })
    .required();

export type CreateWineRequest = z.infer<typeof wineSchema>;

export const updateWineSchema = z
    .object({
        price: numberValidator("Price").optional(),
        designation: textValidator("Designation").optional(),
        variety: nameValidator("Variety").optional(),
        winery: nameValidator("Winery").optional(),
        region: nameValidator("Region").optional(),
    })
    .refine(data =>
        data.price !== undefined ||
        data.designation !== undefined ||
        data.variety !== undefined ||
        data.winery !== undefined ||
        data.region !== undefined,
        {
            message: 'At least one of the fields is required',
        });

export type UpdateWineRequest = z.infer<typeof updateWineSchema>;