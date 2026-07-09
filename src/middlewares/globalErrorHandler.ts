import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { ZodError } from 'zod'
import AppError from '../errors/AppError'

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Validation Error',
      errorDetails: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    })
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorDetails: null,
    })
  }

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Something went wrong',
    errorDetails: err.message || null,
  })
}
