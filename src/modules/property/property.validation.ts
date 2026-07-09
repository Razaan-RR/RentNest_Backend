import { z } from "zod";

export const createPropertyValidation = z.object({
    body: z.object({
        title: z.string().min(2),
        description: z.string().min(5),
        location: z.string(),
        address: z.string(),
        rentAmount: z.number().positive(),
        bedrooms: z.number().int().positive(),
        bathrooms: z.number().int().positive(),
        area: z.number().optional(),
        propertyType: z.string(),
        amenities: z.string().optional(),
        categoryId: z.string()
    })
});

export const updatePropertyValidation = z.object({
    body: createPropertyValidation.shape.body.partial()
});