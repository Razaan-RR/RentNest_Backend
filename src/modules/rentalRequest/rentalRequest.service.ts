import { RentalStatus } from '../../../generated/prisma/enums.js'
import AppError from '../../errors/AppError.js'
import { prisma } from '../../lib/prisma'
import { IRentalRequest, IUpdateRentalStatus } from './rentalRequest.interface'

const createRentalRequestIntoDB = async (
  tenantId: string,
  payload: IRentalRequest,
) => {
  const property = await prisma.property.findUnique({
    where: {
      id: payload.propertyId,
    },
  })

  if (!property) {
    throw new AppError(404, 'Property not found')
  }

  if (property.availability !== 'AVAILABLE') {
    throw new AppError(400, 'Property is not available')
  }

  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId: payload.propertyId,
      status: {
        in: [RentalStatus.PENDING, RentalStatus.APPROVED],
      },
    },
  })

  if (existingRequest) {
    throw new AppError(
      400,
      'You already have an active request for this property',
    )
  }

  const rentalRequest = await prisma.rentalRequest.create({
    data: {
      tenantId,
      ...payload,
    },
    include: {
      property: {
        include: {
          category: true,
        },
      },
    },
  })

  return rentalRequest
}

const getMyRentalRequestsFromDB = async (tenantId: string) => {
  return prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },
    include: {
      property: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

const getSingleRentalRequestFromDB = async (tenantId: string, id: string) => {
  return prisma.rentalRequest.findFirstOrThrow({
    where: {
      id,
      tenantId,
    },
    include: {
      property: {
        include: {
          category: true,
        },
      },
    },
  })
}

const getLandlordRequestsFromDB = async (landlordId: string) => {
  return prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    include: {
      tenant: {
        omit: {
          password: true,
        },
      },
      property: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

const updateRentalRequestStatusIntoDB = async (
  landlordId: string,
  rentalRequestId: string,
  payload: IUpdateRentalStatus,
) => {
  const rentalRequest = await prisma.rentalRequest.findFirst({
    where: {
      id: rentalRequestId,
      property: {
        landlordId,
      },
    },
  })

  if (!rentalRequest) {
    throw new AppError(404, 'Rental request not found')
  }

  if (rentalRequest.status === RentalStatus.REJECTED) {
    throw new AppError(400, 'Rental request cannot be updated')
  }

  const updatedRequest = await prisma.rentalRequest.update({
    where: {
      id: rentalRequestId,
    },
    data: {
      status: payload.status,
    },
    include: {
      tenant: {
        omit: {
          password: true,
        },
      },
      property: true,
    },
  })

  if (payload.status === RentalStatus.APPROVED) {
    await prisma.property.update({
      where: {
        id: updatedRequest.propertyId,
      },
      data: {
        availability: 'RENTED',
      },
    })
  }

  return updatedRequest
}

export const rentalRequestService = {
  createRentalRequestIntoDB,
  getMyRentalRequestsFromDB,
  getSingleRentalRequestFromDB,
  getLandlordRequestsFromDB,
  updateRentalRequestStatusIntoDB,
}
