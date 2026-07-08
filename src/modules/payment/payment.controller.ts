import { Request, Response } from 'express'
import { paymentService } from './payment.service'
import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.createCheckoutSessionIntoDB(
    req.user!.id,
    req.body,
  )

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Payment Intent Created Successfully',
    data: result,
  })
})

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.confirmPaymentIntoDB(req.body)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Payment Confirmed Successfully',
    data: result,
  })
})

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.getMyPaymentsFromDB(req.user!.id)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Payments Retrieved Successfully',
    data: result,
  })
})

const getSinglePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.getSinglePaymentFromDB(
    req.user!.id,
    req.params['id'] as string,
  )

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Payment Retrieved Successfully',
    data: result,
  })
})

export const paymentController = {
  createPaymentIntent,
  confirmPayment,
  getMyPayments,
  getSinglePayment,
}
