import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catchAsync'
import { sendResponse } from '../../utils/sendResponse'
import { adminService } from './admin.service'

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await adminService.getAllUsersFromDB()

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users retrieved successfully',
    data: {
      users,
    },
  })
})

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id!

  if (!id) {
    throw new Error('User ID is required')
  }

  const activeStatus = req.body.activeStatus as 'ACTIVE' | 'BANNED'

  const user = await adminService.updateUserStatusIntoDB(id, activeStatus)

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User status updated successfully',
    data: {
      user,
    },
  })
})

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const properties = await adminService.getAllPropertiesFromDB()

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Properties retrieved successfully',
    data: {
      properties,
    },
  })
})

const getAllRentalRequests = catchAsync(async (req: Request, res: Response) => {
  const rentals = await adminService.getAllRentalRequestsFromDB()

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Rental requests retrieved successfully',
    data: {
      rentals,
    },
  })
})

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentalRequests,
}
