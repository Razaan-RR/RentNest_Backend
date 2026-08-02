import express from 'express'
import { ProfileController } from './profile.controller'
import { ProfileValidation } from './profile.validation'
import { auth } from '../../middlewares/auth'
import { validateRequest } from '../../middlewares/validateRequest'
import { Role } from '../../../generated/prisma/enums'

const router = express.Router()

router.patch(
  '/',
  auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
  validateRequest(ProfileValidation.updateProfileValidationSchema),
  ProfileController.updateProfile,
)

router.get(
  '/',
  auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
  ProfileController.getProfile,
)

export const ProfileRoutes = router
