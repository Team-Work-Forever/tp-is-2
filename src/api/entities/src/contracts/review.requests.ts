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

export const updateReviewSchema = z
    .object({
        points: numberValidator("Points").optional(),
        description: textValidator("Description").optional(),
    })
    .refine(data => data.points !== undefined || data.description !== undefined, {
        message: 'At least one of name or twitterHandle is required',
    });

export type UpdateReviewRequest = z.infer<typeof updateReviewSchema>;