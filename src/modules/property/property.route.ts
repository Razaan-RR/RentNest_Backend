import { Router } from "express";
import { propertyController } from "./property.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums.js";


const router = Router();



router.get(
    "/",
    propertyController.getAllProperties
);



router.get(
    "/:id",
    propertyController.getSingleProperty
);



router.post(
    "/",
    auth(Role.LANDLORD),
    propertyController.createProperty
);



router.put(
    "/:id",
    auth(Role.LANDLORD),
    propertyController.updateProperty
);



router.delete(
    "/:id",
    auth(Role.LANDLORD),
    propertyController.deleteProperty
);



router.get(
    "/landlord/my-properties",
    auth(Role.LANDLORD),
    propertyController.getLandlordProperties
);



export const propertyRoutes = router;