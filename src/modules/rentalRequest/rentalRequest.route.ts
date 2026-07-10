import { Router } from 'express'
import { Role } from '../../../generated/prisma/enums.js'
import { auth } from '../../middlewares/auth'
import { rentalRequestController } from './rentalRequest.controller'
import { validateRequest } from '../../middlewares/validateRequest.js'
import { createRentalRequestValidation, updateRentalStatusValidation } from './rentalRequest.validation.js'

const router = Router()

router.post(
  '/',
  auth(Role.TENANT),
  validateRequest(createRentalRequestValidation),
  rentalRequestController.createRentalRequest,
)

router.get('/', auth(Role.TENANT), rentalRequestController.getMyRentalRequests)

router.get(
  '/:id',
  auth(Role.TENANT),
  rentalRequestController.getSingleRentalRequest,
)

router.patch(
  '/:id',
  auth(Role.LANDLORD),
  validateRequest(updateRentalStatusValidation),
  rentalRequestController.updateRentalRequestStatus,
)

export const rentalRequestRoutes = router
