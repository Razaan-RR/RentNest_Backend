import { prisma } from "../../lib/prisma";
import { ICategory } from "./category.interface";


const createCategoryIntoDB = async (payload: ICategory) => {

    const category = await prisma.category.create({
        data: payload
    });

    return category;
};


const getAllCategoriesFromDB = async () => {

    const categories = await prisma.category.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    return categories;
};


const updateCategoryIntoDB = async (
    id: string,
    payload: Partial<ICategory>
) => {

    const category = await prisma.category.update({
        where: {
            id
        },
        data: payload
    });

    return category;
};


const deleteCategoryFromDB = async (
    id: string
) => {

    const category = await prisma.category.delete({
        where: {
            id
        }
    });

    return category;
};


export const categoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    updateCategoryIntoDB,
    deleteCategoryFromDB
};