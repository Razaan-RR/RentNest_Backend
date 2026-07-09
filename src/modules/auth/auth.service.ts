import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../../config'
import { prisma } from '../../lib/prisma'
import AppError from "../../errors/AppError";


const loginUserFromDB = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password)

  if (!isPasswordMatched) {
    throw new Error('Invalid password')
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



const registerUserIntoDB = async(data:any)=>{

    const exists = await prisma.user.findUnique({
        where:{
            email:data.email
        }
    });


    if(exists){
        throw new AppError(
            400,
            "Email already exists"
        );
    }


    const hashedPassword = await bcrypt.hash(
        data.password,
        12
    );


    const user = await prisma.user.create({
        data:{
            name:data.name,
            email:data.email,
            password:hashedPassword,
            role:data.role
        }
    });


    const {password,...safeUser}=user;

    return safeUser;
};

const getMeFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
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

  return user
}

export const authService = {
  loginUserFromDB,
  getMeFromDB,
  registerUserIntoDB
}
