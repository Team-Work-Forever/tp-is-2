import { z } from "zod";

export function nameValidator(fieldName: string) {
    return z.string({
        required_error: `${fieldName} is required`,
    })
        .min(3)
        .refine((request) => {
            return isNaN(parseFloat(request));
        }, { message: `${fieldName} cannot be a number` });
}