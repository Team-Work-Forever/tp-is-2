import { nameValidator } from 'src/validation/name.validator';
import { z } from 'zod';

export const countrySchema = z
    .object({
        name: nameValidator("Name"),
    })
    .required();

export type CreateCountryRequest = z.infer<typeof countrySchema>;