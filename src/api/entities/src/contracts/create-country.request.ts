import { nameValidator } from 'src/validation/name.validator';
import { z } from 'zod';
import { regionSchema } from './create-region.request';

export const countrySchema = z
    .object({
        name: nameValidator("Name"),
        regions: regionSchema
            .array()
            .optional(),
    });

export type CreateCountryRequest = z.infer<typeof countrySchema>;