import { z } from "zod";

export function numberValidator(fieldName: string) {
    return z.number({
        required_error: `${fieldName} is required`,
    })
        .min(0);
}