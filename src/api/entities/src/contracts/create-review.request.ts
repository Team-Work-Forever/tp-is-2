import { numberValidator } from 'src/validation/number.valitor';
import { textValidator } from 'src/validation/text.validator';
import { twitterHandleValidator } from 'src/validation/twitter-handle.validator';
import { uuidValidator } from 'src/validation/uuid.validator';
import { z } from 'zod';

export const reviewSchema = z
    .object({
        points: numberValidator("Points"),
        description: textValidator("Description"),
        twitterHandle: twitterHandleValidator,
        wineId: uuidValidator("Wine ID")
    })
    .required();

export type CreateReviewRequest = z.infer<typeof reviewSchema>;