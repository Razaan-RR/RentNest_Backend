import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { IUserPayload, IUpdateProfile } from "./user.interface";


const registerUserIntoDB = async (payload: IUserPayload) => {
    const { name, email, password, role } = payload;

    const isUserExist = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (isUserExist) {
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(
        password,
        Number(config.bcrypt_salt_rounds)
    );

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            profile: {
                create: {}
            }
        }
    });

    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id
        },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    });

    return user;
};


const getMyProfileFromDB = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        },
        omit: {
            password: true
        },
        include: {
            profile: true
        }
    });

    return user;
};


const updateMyProfileInDB = async (
    userId: string,
    payload: IUpdateProfile
) => {

    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },

        data: {
            name: payload.name,

            profile: {
                update: {
                    phone: payload.phone,
                    avatar: payload.avatar,
                    dateOfBirth: payload.dateOfBirth,
                    address: payload.address,
                    city: payload.city,
                    state: payload.state,
                    country: payload.country,
                    postalCode: payload.postalCode,
                    bio: payload.bio
                }
            }
        },

        omit: {
            password: true
        },

        include: {
            profile: true
        }
    });

    return updatedUser;
};


export const userService = {
    registerUserIntoDB,
    getMyProfileFromDB,
    updateMyProfileInDB
};