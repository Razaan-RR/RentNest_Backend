import { Router } from "express";
import { Role } from "../../../generated/prisma/enums.js";
import { auth } from "../../middlewares/auth";
import { rentalRequestController } from "./rentalRequest.controller";

const router = Router();

router.post(
    "/",
    auth(Role.TENANT),
    rentalRequestController.createRentalRequest
);

router.get(
    "/",
    auth(Role.TENANT),
    rentalRequestController.getMyRentalRequests
);

router.get(
    "/:id",
    auth(Role.TENANT),
    rentalRequestController.getSingleRentalRequest
);

export const rentalRequestRoutes = router;