import { RentalStatus } from "../../../generated/prisma/enums.js";

export interface IRentalRequest {
    propertyId: string;
    moveInDate: Date;
    duration: number;
    message?: string;
}

export interface IUpdateRentalStatus {
    status: RentalStatus;
}