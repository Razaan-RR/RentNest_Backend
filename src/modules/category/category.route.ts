import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums.js";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCategoryValidation, updateCategoryValidation } from "./category.validation";


const router = Router();


router.get(
    "/",
    categoryController.getAllCategories
);


router.post(
    "/",
    auth(Role.ADMIN),
    validateRequest(createCategoryValidation),
    categoryController.createCategory
);


router.put(
    "/:id",
    auth(Role.ADMIN),
    validateRequest(updateCategoryValidation),
    categoryController.updateCategory
);


router.delete(
    "/:id",
    auth(Role.ADMIN),
    categoryController.deleteCategory
);


export const categoryRoutes = router;