import Stripe from 'stripe'
import config from '../../config'
import { prisma } from '../../lib/prisma'
import { RentalStatus, PaymentStatus } from '../../../generated/prisma/enums'
import { IConfirmPayment, ICreatePayment } from './payment.interface'
import AppError from '../../errors/AppError'

const stripe = new Stripe(config.stripe_secret_key as string)

const createCheckoutSessionIntoDB = async (
  tenantId: string,
  payload: ICreatePayment,
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: payload.rentalRequestId,
    },
    include: {
      property: true,
    },
  })

  const existingPayment = await prisma.payment.findUnique({
    where: {
      rentalRequestId: payload.rentalRequestId,
    },
  })

  if (!rentalRequest) {
    throw new AppError(404, 'Rental request not found')
  }

  if (rentalRequest.tenantId !== tenantId) {
    throw new AppError(403, 'You are not authorized for this payment')
  }

  if (rentalRequest.status !== RentalStatus.APPROVED) {
    throw new AppError(400, 'Rental request is not approved yet')
  }

  if (existingPayment) {
    throw new AppError(400, 'Payment already created for this rental request')
  }

  const amount = Number(rentalRequest.property.rentAmount)

  let session

  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],

      mode: 'payment',

      line_items: [
        {
          price_data: {
            currency: 'usd',

            product_data: {
              name: rentalRequest.property.title,
            },

            unit_amount: Math.round(amount * 100),
          },

          quantity: 1,
        },
      ],

      metadata: {
        rentalRequestId: rentalRequest.id,

        tenantId,
      },

      success_url: `${config.app_url}/success`,

      cancel_url: `${config.app_url}/cancel`,
    })
  } catch (error: any) {
    throw new AppError(
      500,
      `Stripe checkout session creation failed: ${error.message}`,
    )
  }

  let payment

  try {
    payment = await prisma.payment.create({
      data: {
        rentalRequestId: rentalRequest.id,

        tenantId,

        amount,

        checkoutSessionId: session.id,
      },
    })
  } catch (error: any) {
    throw new AppError(500, `Payment record creation failed: ${error.message}`)
  }

  return {
    checkoutUrl: session.url,
    payment,
  }
}

const confirmPaymentIntoDB = async (payload: IConfirmPayment) => {
  let session

  try {
    session = await stripe.checkout.sessions.retrieve(payload.checkoutSessionId)
  } catch (error: any) {
    throw new AppError(400, `Invalid Stripe checkout session: ${error.message}`)
  }

  if (session.payment_status !== 'paid') {
    throw new AppError(400, 'Payment not completed')
  }

  const payment = await prisma.payment.findUnique({
    where: {
      checkoutSessionId: payload.checkoutSessionId,
    },
  })

  if (!payment) {
    throw new AppError(404, 'Payment record not found')
  }

  if (payment.status === PaymentStatus.COMPLETED) {
    return payment
  }

  let updatedPayment

  try {
    updatedPayment = await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.COMPLETED,
        transactionId: session.payment_intent as string,
        paidAt: new Date(),
      },
    })
  } catch (error: any) {
    throw new AppError(500, `Payment update failed: ${error.message}`)
  }

  await prisma.rentalRequest.update({
    where: {
      id: payment.rentalRequestId,
    },
    data: {
      status: RentalStatus.ACTIVE,
    },
  })

  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: payment.rentalRequestId,
    },
    include: {
      property: true,
    },
  })

  if (rentalRequest) {
    await prisma.property.update({
      where: {
        id: rentalRequest.propertyId,
      },
      data: {
        availability: 'RENTED',
      },
    })
  }

  return updatedPayment
}

const getMyPaymentsFromDB = async (tenantId: string) => {
  return prisma.payment.findMany({
    where: {
      tenantId,
    },

    include: {
      rentalRequest: {
        include: {
          property: {
            include: {
              category: true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  })
}

const getSinglePaymentFromDB = async (tenantId: string, paymentId: string) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
      tenantId,
    },

    include: {
      rentalRequest: {
        include: {
          property: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  })

  if (!payment) {
    throw new AppError(404, 'Payment not found')
  }

  return payment
}

export const paymentService = {
  createCheckoutSessionIntoDB,
  confirmPaymentIntoDB,
  getMyPaymentsFromDB,
  getSinglePaymentFromDB,
}
