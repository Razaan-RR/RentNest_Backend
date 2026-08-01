import { Router } from "express";
import { Role } from "../../../generated/prisma/enums.js";
import { auth } from "../../middlewares/auth";
import { adminController } from "./admin.controller";

const router = Router();

router.get(
    "/users",
    auth(Role.ADMIN),
    adminController.getAllUsers
);

router.patch(
    "/users/:id",
    auth(Role.ADMIN),
    adminController.updateUserStatus
);

router.get(
    "/properties",
    auth(Role.ADMIN),
    adminController.getAllProperties
);

router.get(
    "/rentals",
    auth(Role.ADMIN),
    adminController.getAllRentalRequests
);

router.get(
  "/stats",
  auth(Role.ADMIN),
  adminController.getAdminStats
)

export const adminRoutes = router;