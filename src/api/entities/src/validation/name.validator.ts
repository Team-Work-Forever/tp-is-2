import { z } from "zod";

export function nameValidator(fieldName: string) {
    return z.string({
        required_error: `${fieldName} is required`,
    })
        // .min(3) // TODO: Uncomment this line to validate the minimum length of the name
        .refine((request) => {
            return isNaN(parseFloat(request));
        }, { message: `${fieldName} cannot be a number` });
}