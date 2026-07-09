import { Router } from 'express'
import { Role } from '../../../generated/prisma/enums.js'
import { auth } from '../../middlewares/auth'
import { userController } from './user.controller'
import { validateRequest } from '../../middlewares/validateRequest.js'
import { registerValidation, updateProfileValidation } from './user.validation.js'

const router = Router()

router.get(
  '/me',
  auth(Role.ADMIN, Role.TENANT, Role.LANDLORD),
  userController.getMyProfile,
)

router.put(
  '/my-profile',
  auth(Role.ADMIN, Role.TENANT, Role.LANDLORD),
  validateRequest(updateProfileValidation),
  userController.updateMyProfile,
)

export const userRoutes = router
