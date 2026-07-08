import { ActiveStatus, Role } from "../../../generated/prisma/enums";

export interface IUser {
    id?: string;
    name: string;
    email: string;
    password: string;
    role?: Role;
    activeStatus?: ActiveStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserPayload {
    name: string;
    email: string;
    password: string;
    role: Role;
}

export interface IUpdateProfile {
    name?: string;
    phone?: string;
    avatar?: string;
    dateOfBirth?: Date;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    bio?: string;
}