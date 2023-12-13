import { z } from "zod";

export function textValidator(fieldName: string) {
    return z.string({
        required_error: `${fieldName} is required`,
    })
        .min(3);
}