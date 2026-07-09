import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import AppError from '../errors/AppError'

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong',
    errorDetails: err.details || null,
  })
}
