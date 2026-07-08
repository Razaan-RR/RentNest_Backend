import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalRequestService } from "./rentalRequest.service";

const createRentalRequest = catchAsync(async (req: Request, res: Response) => {

    const rentalRequest = await rentalRequestService.createRentalRequestIntoDB(
        req.user!.id,
        req.body
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Rental request submitted successfully",
        data: {
            rentalRequest
        }
    });
});

const getMyRentalRequests = catchAsync(async (req: Request, res: Response) => {

    const rentalRequests = await rentalRequestService.getMyRentalRequestsFromDB(
        req.user!.id
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental requests fetched successfully",
        data: {
            rentalRequests
        }
    });
});

const getSingleRentalRequest = catchAsync(async (req: Request, res: Response) => {

    const rentalRequest = await rentalRequestService.getSingleRentalRequestFromDB(
        req.user!.id,
        req.params.id as string
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental request fetched successfully",
        data: {
            rentalRequest
        }
    });
});

const getLandlordRequests = catchAsync(async (req: Request, res: Response) => {

    const rentalRequests = await rentalRequestService.getLandlordRequestsFromDB(
        req.user!.id
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Landlord rental requests fetched successfully",
        data: {
            rentalRequests
        }
    });
});

const updateRentalRequestStatus = catchAsync(async (req: Request, res: Response) => {

    const rentalRequest =
        await rentalRequestService.updateRentalRequestStatusIntoDB(
            req.user!.id,
            req.params.id as string,
            req.body
        );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental request updated successfully",
        data: {
            rentalRequest
        }
    });
});

export const rentalRequestController = {
    createRentalRequest,
    getMyRentalRequests,
    getSingleRentalRequest,
    getLandlordRequests,
    updateRentalRequestStatus
};