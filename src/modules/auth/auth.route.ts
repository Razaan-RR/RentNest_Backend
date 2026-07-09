import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums.js";
import { validateRequest } from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";

const router = Router();

router.post(
    "/login",
    validateRequest(
        authValidation.loginValidation
    ),
    authController.loginUser
);

router.post(
    "/register",
    validateRequest(
        authValidation.registerValidation
    ),
    authController.registerUser
);

router.get(
    "/me",
    auth(Role.ADMIN, Role.TENANT, Role.LANDLORD),
    authController.getMe
);

export const authRoutes = router;