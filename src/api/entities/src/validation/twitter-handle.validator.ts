import { z } from "zod";

export const twitterHandleValidator = z.string({
    required_error: "Twitter handle is required",
})
    .refine((request) => {
        return isNaN(parseFloat(request));
    }, { message: "Twitter handle cannot be a number" })
    .refine((request) => {
        return request.startsWith("@");
    }, { message: "Twitter handle must start with @" });