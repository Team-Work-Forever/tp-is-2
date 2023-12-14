import { nameValidator } from 'src/validation/name.validator';
import { twitterHandleValidator } from 'src/validation/twitter-handle.validator';
import { z } from 'zod';

export const tasterSchema = z
    .object({
        name: nameValidator("Name"),
        twitterHandle: twitterHandleValidator
    })
    .required();

export type CreateTasterRequest = z.infer<typeof tasterSchema>;

export const updateTasterSchema = z
    .object({
        name: nameValidator("Name").optional(),
        twitterHandle: twitterHandleValidator.optional()
    })
    .refine(data => data.name !== undefined || data.twitterHandle !== undefined, {
        message: 'At least one of name or twitterHandle is required',
    });

export type UpdateTasterRequest = z.infer<typeof updateTasterSchema>;