import express from "express";
import { ProfileController } from "./profile.controller";
import { ProfileValidation } from "./profile.validation";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.patch(
  "/",
  auth(Role.TENANT, Role.LANDLORD),
  validateRequest(ProfileValidation.updateProfileValidationSchema),
  ProfileController.updateProfile
);

export const ProfileRoutes = router;