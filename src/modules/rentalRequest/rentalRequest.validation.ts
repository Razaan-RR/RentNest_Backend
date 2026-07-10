import { z } from "zod";

export const createRentalRequestValidation = z.object({
    body: z.object({
        propertyId: z.string(),
        moveInDate: z.string().date(),
        duration: z.number().positive(),
        message: z.string().optional(),
    })
});


export const updateRentalStatusValidation = z.object({
    body: z.object({
        status: z.enum([
            "APPROVED",
            "REJECTED",
            "COMPLETED"
        ])
    })
});