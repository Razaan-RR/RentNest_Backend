import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import config from '../../config'
import { prisma } from '../../lib/prisma'
import AppError from '../../errors/AppError'

const loginUserFromDB = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password')
  }

  if (user.activeStatus === 'BANNED') {
    throw new AppError(httpStatus.FORBIDDEN, 'Your account has been banned')
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password)

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password')
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    config.jwt_access_secret as string,
    {
      expiresIn: config.jwt_access_expires_in as any,
    },
  )

  const { password: _, ...userWithoutPassword } = user

  return {
    accessToken,
    user: userWithoutPassword,
  }
}

const registerUserIntoDB = async (data: any) => {
  const exists = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  })

  if (exists) {
    throw new AppError(httpStatus.CONFLICT, 'Email already exists')
  }

  const hashedPassword = await bcrypt.hash(data.password, 12)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
  })

  const { password: _, ...safeUser } = user

  return safeUser
}

const getMeFromDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  })

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found')
  }

  return user
}

export const authService = {
  loginUserFromDB,
  registerUserIntoDB,
  getMeFromDB,
}
