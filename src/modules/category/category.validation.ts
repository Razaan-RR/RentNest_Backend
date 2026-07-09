import { z } from "zod";

export const createCategoryValidation = z.object({
    body: z.object({
        name: z.string().min(2),
        description: z.string().optional()
    })
});


export const updateCategoryValidation = z.object({
    body: z.object({
        name: z.string().min(2).optional(),
        description: z.string().optional()
    })
});