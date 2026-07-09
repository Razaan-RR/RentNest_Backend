import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { createPropertyValidation, updatePropertyValidation } from "./property.validation";
import { Role } from "../../../generated/prisma/enums.js";

const router = Router();

router.get(
    "/",
    propertyController.getAllProperties
);

router.get(
    "/landlord/my-properties",
    auth(Role.LANDLORD),
    propertyController.getLandlordProperties
);

router.get(
    "/:id",
    propertyController.getSingleProperty
);

router.post(
    "/",
    auth(Role.LANDLORD),
    validateRequest(createPropertyValidation),
    propertyController.createProperty
);

router.put(
    "/:id",
    auth(Role.LANDLORD),
    validateRequest(updatePropertyValidation),
    propertyController.updateProperty
);

router.delete(
    "/:id",
    auth(Role.LANDLORD),
    propertyController.deleteProperty
);

export const propertyRoutes = router;