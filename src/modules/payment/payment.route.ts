import { Router } from "express";
import { Role } from "../../../generated/prisma/enums.js";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";


const router = Router();


router.post(
    "/create",
    auth(Role.TENANT),
    paymentController.createPaymentIntent
);


router.post(
    "/confirm",
    auth(Role.TENANT),
    paymentController.confirmPayment
);


router.get(
    "/",
    auth(Role.TENANT),
    paymentController.getMyPayments
);


router.get(
    "/:id",
    auth(Role.TENANT),
    paymentController.getSinglePayment
);


export const paymentRoutes = router;