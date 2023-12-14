import { nameValidator } from 'src/validation/name.validator';
import { z } from 'zod';
import { regionSchema } from './region.requests';

export const countrySchema = z
    .object({
        name: nameValidator("Name"),
        regions: regionSchema
            .array()
            .optional(),
    });

export type CreateCountryRequest = z.infer<typeof countrySchema>;

export const updateCountrySchema = z
    .object({
        name: nameValidator("Name"),
    })
    .required();

export type UpdateCountryRequest = z.infer<typeof countrySchema>;