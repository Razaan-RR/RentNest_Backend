import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

const getAllUsersFromDB = async () => {

    return prisma.user.findMany({
        omit: {
            password: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

};

const updateUserStatusIntoDB = async (
    userId: string,
    activeStatus: "ACTIVE" | "BANNED"
) => {

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!user) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            "User not found"
        );
    }

    if (user.role === "ADMIN") {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Admin status cannot be changed"
        );
    }

    return prisma.user.update({
        where: {
            id: userId
        },
        data: {
            activeStatus
        },
        omit: {
            password: true
        }
    });

};

const getAllPropertiesFromDB = async () => {

    return prisma.property.findMany({

        include: {

            landlord: {
                omit: {
                    password: true
                }
            },

            category: true

        },

        orderBy: {
            createdAt: "desc"
        }

    });

};

const getAllRentalRequestsFromDB = async () => {

    return prisma.rentalRequest.findMany({

        include: {

            tenant: {
                omit: {
                    password: true
                }
            },

            property: {
                include: {
                    category: true
                }
            }

        },

        orderBy: {
            createdAt: "desc"
        }

    });

};

export const adminService = {
    getAllUsersFromDB,
    updateUserStatusIntoDB,
    getAllPropertiesFromDB,
    getAllRentalRequestsFromDB
};