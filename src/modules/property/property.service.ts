import { prisma } from '../../lib/prisma'
import { IProperty } from './property.interface'

const createPropertyIntoDB = async (landlordId: string, payload: IProperty) => {
  const property = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },

    include: {
      category: true,
      landlord: {
        omit: {
          password: true,
        },
      },
    },
  })

  return property
}

const getAllPropertiesFromDB = async (filters: any) => {
  const { location, propertyType, minPrice, maxPrice } = filters

  const properties = await prisma.property.findMany({
    where: {
      location: location
        ? {
            contains: location,
            mode: 'insensitive',
          }
        : undefined,

      propertyType: propertyType ? propertyType : undefined,

      rentAmount: {
        gte: minPrice ? Number(minPrice) : undefined,

        lte: maxPrice ? Number(maxPrice) : undefined,
      },
    },

    include: {
      category: true,
      landlord: {
        omit: {
          password: true,
        },
      },
    },
  })

  return properties
}

const getSinglePropertyFromDB = async (id: string) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id,
    },

    include: {
      category: true,
      landlord: {
        omit: {
          password: true,
        },
      },
    },
  })

  return property
}

const updatePropertyIntoDB = async (
  id: string,
  landlordId: string,
  payload: Partial<IProperty>,
) => {
  const property = await prisma.property.update({
    where: {
      id,
      landlordId,
    },

    data: payload,

    include: {
      category: true,
    },
  })

  return property
}

const deletePropertyFromDB = async (id: string, landlordId: string) => {
  const property = await prisma.property.delete({
    where: {
      id,
      landlordId,
    },
  })

  return property
}

const getLandlordPropertiesFromDB = async (landlordId: string) => {
  const properties = await prisma.property.findMany({
    where: {
      landlordId,
    },

    include: {
      category: true,
    },
  })

  return properties
}

export const propertyService = {
  createPropertyIntoDB,
  getAllPropertiesFromDB,
  getSinglePropertyFromDB,
  updatePropertyIntoDB,
  deletePropertyFromDB,
  getLandlordPropertiesFromDB,
}
