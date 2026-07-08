import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { propertyService } from "./property.service";



const createProperty = catchAsync(
    async(req: Request,res: Response)=>{

        const property =
            await propertyService.createPropertyIntoDB(
                req.user?.id as string,
                req.body
            );


        sendResponse(res,{
            success:true,
            statusCode:httpStatus.CREATED,
            message:"Property created successfully",
            data:{
                property
            }
        });
    }
);



const getAllProperties = catchAsync(
    async(req:Request,res:Response)=>{

        const properties =
            await propertyService.getAllPropertiesFromDB(
                req.query
            );


        sendResponse(res,{
            success:true,
            statusCode:httpStatus.OK,
            message:"Properties fetched successfully",
            data:{
                properties
            }
        });
    }
);



const getSingleProperty = catchAsync(
    async(req:Request,res:Response)=>{

        const property =
            await propertyService.getSinglePropertyFromDB(
                req.params.id as string
            );


        sendResponse(res,{
            success:true,
            statusCode:httpStatus.OK,
            message:"Property fetched successfully",
            data:{
                property
            }
        });
    }
);



const updateProperty = catchAsync(
    async(req:Request,res:Response)=>{

        const property =
            await propertyService.updatePropertyIntoDB(
                req.params.id as string,
                req.user?.id as string,
                req.body
            );


        sendResponse(res,{
            success:true,
            statusCode:httpStatus.OK,
            message:"Property updated successfully",
            data:{
                property
            }
        });
    }
);



const deleteProperty = catchAsync(
    async(req:Request,res:Response)=>{

        await propertyService.deletePropertyFromDB(
            req.params.id as string,
            req.user?.id as string
        );


        sendResponse(res,{
            success:true,
            statusCode:httpStatus.OK,
            message:"Property deleted successfully",
            data:null
        });
    }
);



const getLandlordProperties = catchAsync(
    async(req:Request,res:Response)=>{

        const properties =
            await propertyService.getLandlordPropertiesFromDB(
                req.user?.id as string
            );


        sendResponse(res,{
            success:true,
            statusCode:httpStatus.OK,
            message:"Landlord properties fetched successfully",
            data:{
                properties
            }
        });
    }
);



export const propertyController = {
    createProperty,
    getAllProperties,
    getSingleProperty,
    updateProperty,
    deleteProperty,
    getLandlordProperties
};