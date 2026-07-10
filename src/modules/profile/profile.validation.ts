import { z } from "zod";

const updateProfileValidationSchema = z.object({
  body: z.object({
    phone: z.string().optional(),
    avatar: z.string().optional(),
    dateOfBirth: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    bio: z.string().optional(),
  }),
});

export const ProfileValidation = {
  updateProfileValidationSchema,
};