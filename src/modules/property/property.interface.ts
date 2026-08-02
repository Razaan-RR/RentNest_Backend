import { AvailabilityStatus } from "../../../generated/prisma/enums.js";


export interface IProperty {
    title: string;
    description: string;

    location: string;
    address: string;

    rentAmount: number;

    bedrooms: number;
    bathrooms: number;

    area?: number;

    propertyType: string;

    amenities?: string;

    images?: string[];

    availability?: AvailabilityStatus;

    categoryId: string;
}