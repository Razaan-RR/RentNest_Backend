import httpStatus from "http-status";
import { ProfileService } from "./profile.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const updateProfile = catchAsync(async (req, res) => {
  const userId = req.user!.id;

  const result = await ProfileService.updateProfileIntoDB(
    userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

export const ProfileController = {
  updateProfile,
};