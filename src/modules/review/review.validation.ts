import { z } from "zod";

export const createReviewValidation = z.object({
  body: z.object({
    rentalRequestId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().min(1)
  })
});