import { Router } from "express";
import { Role } from "../../../generated/prisma/enums.js";
import { auth } from "../../middlewares/auth";
import { reviewController } from "./review.controller";

const router = Router();

router.post(
    "/",
    auth(Role.TENANT),
    reviewController.createReview
);

router.get(
    "/property/:id",
    reviewController.getPropertyReviews
);



export const reviewRoutes = router;