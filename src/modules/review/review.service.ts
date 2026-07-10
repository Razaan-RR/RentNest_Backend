import AppError from '../../errors/AppError'
import { prisma } from '../../lib/prisma'
import { IReview } from './review.interface'

const createReviewIntoDB = async (tenantId: string, payload: IReview) => {
  const rentalRequest = await prisma.rentalRequest.findFirst({
    where: {
      id: payload.rentalRequestId,
      tenantId,
    },
    include: {
      property: true,
    },
  })

  if (!rentalRequest) {
    throw new AppError(404, 'Rental request not found')
  }

  if (rentalRequest.status !== 'COMPLETED') {
    throw new AppError(400, 'You can only review completed rentals')
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      rentalRequestId: payload.rentalRequestId,
    },
  })

  if (existingReview) {
    throw new AppError(400, 'You already reviewed this rental')
  }

  const review = await prisma.review.create({
    data: {
      tenantId,
      propertyId: rentalRequest.propertyId,
      rentalRequestId: payload.rentalRequestId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      property: true,
      tenant: {
        omit: {
          password: true,
        },
      },
    },
  })

  return review
}

const getPropertyReviewsFromDB = async (propertyId: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  })

  if (!property) {
    throw new AppError(404, 'Property not found')
  }

  const reviews = await prisma.review.findMany({
    where: {
      propertyId,
    },
    include: {
      tenant: {
        omit: {
          password: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return reviews
}

export const reviewService = {
  createReviewIntoDB,
  getPropertyReviewsFromDB,
}
