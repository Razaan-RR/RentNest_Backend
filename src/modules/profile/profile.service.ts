import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IUpdateProfile } from "./profile.interface";
import { prisma } from "../../lib/prisma";

const updateProfileIntoDB = async (
  userId: string,
  payload: IUpdateProfile
) => {
  // Check user exists
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const profileData = {
    ...(payload.phone !== undefined && { phone: payload.phone }),
    ...(payload.avatar !== undefined && { avatar: payload.avatar }),
    ...(payload.dateOfBirth !== undefined && {
      dateOfBirth: payload.dateOfBirth
        ? new Date(payload.dateOfBirth)
        : null,
    }),
    ...(payload.address !== undefined && { address: payload.address }),
    ...(payload.city !== undefined && { city: payload.city }),
    ...(payload.state !== undefined && { state: payload.state }),
    ...(payload.country !== undefined && { country: payload.country }),
    ...(payload.postalCode !== undefined && {
      postalCode: payload.postalCode,
    }),
    ...(payload.bio !== undefined && { bio: payload.bio }),
  };

  const profile = await prisma.profile.upsert({
    where: {
      userId,
    },
    update: profileData,
    create: {
      userId,
      ...profileData,
    },
  });

  return profile;
};

export const ProfileService = {
  updateProfileIntoDB,
};