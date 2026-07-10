import { Router } from 'express'
import { Role } from '../../../generated/prisma/enums.js'
import { auth } from '../../middlewares/auth'
import { paymentController } from './payment.controller'
import { validateRequest } from '../../middlewares/validateRequest'
import {
  createPaymentValidation,
  confirmPaymentValidation,
} from './payment.validation'

const router = Router()

router.post(
  '/create',
  auth(Role.TENANT),
  validateRequest(createPaymentValidation),
  paymentController.createPaymentIntent,
)

router.post(
  '/confirm',
  auth(Role.TENANT),
  validateRequest(confirmPaymentValidation),
  paymentController.confirmPayment,
)

router.get('/', auth(Role.TENANT), paymentController.getMyPayments)

router.get('/:id', auth(Role.TENANT), paymentController.getSinglePayment)

export const paymentRoutes = router
