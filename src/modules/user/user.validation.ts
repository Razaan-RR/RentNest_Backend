import { z } from "zod";

export const registerValidation = z.object({
    body:z.object({
        name:z.string().min(2),
        email:z.string().email(),
        password:z.string().min(6),
        role:z.enum([
            "TENANT",
            "LANDLORD"
        ])
    })
});


export const updateProfileValidation = z.object({
    body:z.object({
        name:z.string().optional(),
        phone:z.string().optional(),
        avatar:z.string().optional(),
        address:z.string().optional(),
        city:z.string().optional(),
        state:z.string().optional(),
        country:z.string().optional(),
        postalCode:z.string().optional(),
        bio:z.string().optional(),
        dateOfBirth:z.string().datetime().optional()
    })
});