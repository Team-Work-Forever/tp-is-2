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