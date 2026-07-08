import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";


const createReview = catchAsync(
    async (req: Request, res: Response) => {


        const review =
            await reviewService.createReviewIntoDB(
                req.user!.id,
                req.body
            );


        sendResponse(res, {

            success: true,

            statusCode:
                httpStatus.CREATED,

            message:
                "Review created successfully",

            data: {
                review
            }

        });

    }
);



const getPropertyReviews = catchAsync(
    async (req: Request, res: Response) => {


        const reviews =
            await reviewService.getPropertyReviewsFromDB(
                req.params.id as string
            );


        sendResponse(res, {

            success: true,

            statusCode:
                httpStatus.OK,

            message:
                "Property reviews fetched successfully",

            data: {
                reviews
            }

        });

    }
);



export const reviewController = {

    createReview,

    getPropertyReviews

};