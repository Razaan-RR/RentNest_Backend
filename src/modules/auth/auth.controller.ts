import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { authService } from "./auth.service";


const loginUser = catchAsync(
    async (req: Request, res: Response) => {

        const { email, password } = req.body;


        const result = await authService.loginUserFromDB(
            email,
            password
        );


        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Login successful",
            data: result
        });
    }
);



const getMe = catchAsync(
    async (req: Request, res: Response) => {

        const user = await authService.getMeFromDB(
            req.user?.id as string
        );


        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Current user fetched successfully",
            data: {
                user
            }
        });
    }
);

const registerUser = catchAsync(
    async(req: Request,res: Response)=>{

        const result = await authService.registerUserIntoDB(req.body);

        sendResponse(res,{
            success:true,
            statusCode:httpStatus.CREATED,
            message:"User registered successfully",
            data:result
        });
    }
);


export const authController = {
    registerUser,
    loginUser,
    getMe
};