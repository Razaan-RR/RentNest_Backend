import Stripe from 'stripe'
import config from '../../config'
import { prisma } from '../../lib/prisma'
import { RentalStatus, PaymentStatus } from '../../../generated/prisma/enums'
import { IConfirmPayment, ICreatePayment } from './payment.interface'

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

  if (!rentalRequest) {
    throw new Error('Rental request not found')
  }

  if (rentalRequest.tenantId !== tenantId) {
    throw new Error('Unauthorized')
  }

  if (rentalRequest.status !== 'APPROVED') {
    throw new Error('Rental request is not approved')
  }

  const amount = Number(rentalRequest.property.rentAmount)
  console.log('SUCCESS URL:', `${config.app_url}/success`)
  console.log('CANCEL URL:', `${config.app_url}/cancel`)
  const session = await stripe.checkout.sessions.create({
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

  const payment = await prisma.payment.create({
    data: {
      rentalRequestId: rentalRequest.id,

      tenantId,

      amount,

      checkoutSessionId: session.id,
    },
  })

  return {
    checkoutUrl: session.url,
    payment,
  }
}

const confirmPaymentIntoDB = async (payload: IConfirmPayment) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    payload.paymentIntentId,
  )

  if (paymentIntent.status !== 'succeeded') {
    throw new Error('Payment not completed.')
  }

  const payment = await prisma.payment.findFirst({
    where: {
      paymentIntentId: payload.paymentIntentId,
    },
  })

  if (!payment) {
    throw new Error('Payment not found.')
  }

  if (payment.status === PaymentStatus.COMPLETED) {
    return payment
  }

  // Update payment
  const updatedPayment = await prisma.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      status: PaymentStatus.COMPLETED,
      transactionId: paymentIntent.id,
      paidAt: new Date(),
    },
  })

  // Activate rental
  await prisma.rentalRequest.update({
    where: {
      id: payment.rentalRequestId,
    },
    data: {
      status: RentalStatus.ACTIVE,
    },
  })

  // Make property unavailable
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
    throw new Error('Payment not found.')
  }

  return payment
}

export const paymentService = {
  createCheckoutSessionIntoDB,
  confirmPaymentIntoDB,
  getMyPaymentsFromDB,
  getSinglePaymentFromDB,
}
