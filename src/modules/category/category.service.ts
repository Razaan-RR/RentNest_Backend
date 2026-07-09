import AppError from '../../errors/AppError'
import { prisma } from '../../lib/prisma'
import { ICategory } from './category.interface'


const createCategoryIntoDB = async (payload: ICategory) => {

    const exists = await prisma.category.findUnique({
        where: {
            name: payload.name
        }
    });

    if (exists) {
        throw new AppError(
            400,
            "Category already exists"
        );
    }

    const category = await prisma.category.create({
        data: payload
    });

    return category;
};

const getAllCategoriesFromDB = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return categories
}

const updateCategoryIntoDB = async (
  id: string,
  payload: Partial<ICategory>,
) => {
  const category = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  })

  return category
}

const deleteCategoryFromDB = async (id: string) => {
  try {
    const category = await prisma.category.delete({
      where: {
        id,
      },
    })

    return category
  } catch (error) {
    throw new AppError(400, 'Category cannot be deleted while properties exist')
  }
}

export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
}
