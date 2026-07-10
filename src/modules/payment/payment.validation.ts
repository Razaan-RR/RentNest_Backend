import { z } from "zod";

export const createPaymentValidation = z.object({
    body: z.object({
        rentalRequestId: z
            .string()
            .uuid("Invalid rental request ID"),
    }),
});


export const confirmPaymentValidation = z.object({
    body: z.object({
        checkoutSessionId: z
            .string()
            .min(1, "Checkout session ID is required"),
    }),
});