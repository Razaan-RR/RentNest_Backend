import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums.js";

const router = Router();

router.post(
    "/login",
    authController.loginUser
);

router.get(
    "/me",
    auth(Role.ADMIN, Role.TENANT, Role.LANDLORD),
    authController.getMe
);

export const authRoutes = router;