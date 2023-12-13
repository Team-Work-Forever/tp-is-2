import { z } from "zod";

export function uuidValidator(fieldName: string) {
    return z.string({
        required_error: `${fieldName} is required`,
    }).uuid({
        message: `${fieldName} must be a valid UUID`,
    })
}