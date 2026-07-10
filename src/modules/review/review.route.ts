import { Router } from "express";
import { Role } from "../../../generated/prisma/enums.js";
import { auth } from "../../middlewares/auth";
import { reviewController } from "./review.controller";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createReviewValidation } from "./review.validation.js";

const router = Router();

router.post(
    "/",
    auth(Role.TENANT),
    validateRequest(createReviewValidation),
    reviewController.createReview
);

router.get(
    "/property/:id",
    reviewController.getPropertyReviews
);



export const reviewRoutes = router;