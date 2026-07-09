import { Router } from 'express'
import { Role } from '../../../generated/prisma/enums.js'
import { auth } from '../../middlewares/auth'
import { rentalRequestController } from '../rentalRequest/rentalRequest.controller'
import { validateRequest } from '../../middlewares/validateRequest.js'
import { updateRentalStatusValidation } from '../rentalRequest/rentalRequest.validation.js'

const router = Router()

router.get(
  '/requests',
  auth(Role.LANDLORD),
  rentalRequestController.getLandlordRequests,
)

router.patch(
  '/requests/:id',
  auth(Role.LANDLORD),
  validateRequest(updateRentalStatusValidation),
  rentalRequestController.updateRentalRequestStatus,
)

export const landlordRoutes = router
