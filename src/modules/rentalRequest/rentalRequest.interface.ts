import { RentalStatus } from "../../../generated/prisma/enums.js";

export interface IRentalRequest {
    propertyId: string;
    moveInDate: string;
    duration: number;
    message?: string;
}

export interface IUpdateRentalStatus {
    status: RentalStatus;
}