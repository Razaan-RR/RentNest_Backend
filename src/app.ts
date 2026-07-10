import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import config from "./config";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoutes } from "./modules/category/category.route";
import { propertyRoutes } from "./modules/property/property.route";
import { rentalRequestRoutes } from "./modules/rentalRequest/rentalRequest.route";
import { landlordRoutes } from "./modules/landlord/landlord.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { reviewRoutes } from "./modules/review/review.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { adminRoutes } from "./modules/admin/admin.route";
import { ProfileRoutes } from "./modules/profile/profile.route";

const app: Application = express();


app.use(
    cors({
        origin: config.app_url,
        credentials: true,
    })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "RentNest API is running"
    });
});


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/rentals", rentalRequestRoutes);
app.use("/api/landlord", landlordRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/success", (req, res) => {
    res.send("Payment successful. You can close this page.");
});

app.get("/cancel", (req, res) => {
    res.send("Payment cancelled.");
});

app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", ProfileRoutes);
app.use(globalErrorHandler);

export default app;