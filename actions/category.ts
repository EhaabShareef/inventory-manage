"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { categorySchema } from "@/schemas/category"
import type { Category, CategoryWithItemCount, CategoryFormData } from "@/types/category"
import { logActivity } from "@/lib/audit-logger"

export async function getCategories(search = ""): Promise<{ categories: CategoryWithItemCount[] } | { error: string }> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: search,
        },
      },
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return { categories }
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return { error: "Failed to fetch categories" }
  }
}

export async function createCategory(
  formData: FormData,
): Promise<{ category: Category } | { error: string; errors?: Record<string, string[]> }> {
  const categoryData = {
    name: formData.get("name") as string,
  }

  const validationResult = categorySchema.safeParse(categoryData)

  if (!validationResult.success) {
    console.error("Validation failed:", validationResult.error.errors)
    return {
      error: "Validation failed",
      errors: validationResult.error.flatten().fieldErrors,
    }
  }

  const validatedData = validationResult.data

  try {
    const prismaCategory = await prisma.category.create({
      data: validatedData,
    })

    await logActivity("CATEGORY_CREATED", `New category created: ${prismaCategory.name} (ID: ${prismaCategory.id})`)

    revalidatePath("/admin/category")
    return { category: prismaCategory }
  } catch (error) {
    console.error("Failed to create category:", error instanceof Error ? error.message : String(error))
    return { error: "Failed to create category" }
  }
}

export async function updateCategory(
  formData: FormData,
): Promise<{ category: Category } | { error: string; errors?: Record<string, string[]> }> {
  const categoryData: CategoryFormData = {
    name: formData.get("name") as string,
  }

  const validationResult = categorySchema.safeParse(categoryData)

  if (!validationResult.success) {
    console.error("Validation failed:", validationResult.error.errors)
    return {
      error: "Validation failed",
      errors: validationResult.error.flatten().fieldErrors,
    }
  }

  const validatedData = validationResult.data
  const categoryId = Number(formData.get("id"))

  try {
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: validatedData,
    })

    await logActivity("CATEGORY_UPDATED", `Category updated: ${updatedCategory.name} (ID: ${updatedCategory.id})`)

    revalidatePath("/admin/category")
    return { category: updatedCategory }
  } catch (error) {
    console.error("Failed to update category:", error)
    return { error: "Failed to update category" }
  }
}

export async function deleteCategory(id: number) {
  try {
    const category = await prisma.category.delete({
      where: { id },
    })

    await logActivity("CATEGORY_DELETED", `Category deleted: ${category.name} (ID: ${category.id})`)

    revalidatePath("/admin/category")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete category" }
  }
}

export async function getCategoryById(id: number) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { items: true },
        },
      },
    })
    if (!category) {
      return { error: "Category not found" }
    }
    return { category }
  } catch (error) {
    console.error("Failed to fetch category:", error)
    return { error: "Failed to fetch category" }
  }
}

