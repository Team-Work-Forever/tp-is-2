import { nameValidator } from 'src/validation/name.validator';
import { numberValidator } from 'src/validation/number.valitor';
import { textValidator } from 'src/validation/text.validator';
import { z } from 'zod';

export const wineSchema = z
    .object({
        price: numberValidator("Price"),
        designation: textValidator("Designation"),
        variety: nameValidator("Variety"),
        winery: nameValidator("Winery"),
        region: nameValidator("Region"),
    })
    .required();

export type CreateWineRequest = z.infer<typeof wineSchema>;