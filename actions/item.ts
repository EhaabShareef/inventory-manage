"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { itemSchema } from "@/schemas/item"
import type { Item, Category, PrismaItem } from "@/types/item"
import { convertPrismaItemToItem } from '@/lib/converters';
import { logActivity } from '@/lib/audit-logger';

export async function getItems(
  search: string = "",
  categoryId?: number,
  page: number = 1,
  pageSize: number = 10
): Promise<{ items: Item[]; totalCount: number; totalPages: number } | { error: string }> {
  try {
    const where: Prisma.ItemWhereInput = {
      AND: [
        categoryId ? { categoryId } : {},
        {
          OR: [
            { partNo: { contains: search } },
            { itemName: { contains: search } },
            { model: { contains: search } },
          ],
        },
      ],
    };

    const [prismaItems, totalCount] = await Promise.all([
      prisma.item.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
        orderBy: { itemName: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.item.count({ where }),
    ]);

    const items = prismaItems.map(convertPrismaItemToItem);

    return {
      items,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return { error: "Failed to fetch items" };
  }
}

export async function createItem(
  formData: FormData,
): Promise<{ item: Item } | { error: string; errors?: Record<string, string[]> }> {
  
  const itemData = {
    partNo: formData.get("partNo") as string | null,
    itemName: formData.get("itemName") as string,
    model: formData.get("model") as string | null,
    categoryId: Number(formData.get("categoryId")),
    listPrice: Number(formData.get("listPrice")),
    sellingPrice: Number(formData.get("sellingPrice")),
    amcPrice: formData.get("amcPrice") ? Number(formData.get("amcPrice")) : null,
    nonAmcPrice: formData.get("nonAmcPrice") ? Number(formData.get("nonAmcPrice")) : null,
    priceValidTill: formData.get("priceValidTill") ? new Date(formData.get("priceValidTill") as string) : null,
  }

  // Validate the data using the Zod schema
  const validationResult = itemSchema.safeParse(itemData)

  if (!validationResult.success) {
    console.error("Validation failed:", validationResult.error.errors)
    return {
      error: "Validation failed",
      errors: validationResult.error.flatten().fieldErrors,
    }
  }

  const validatedData = validationResult.data

  try {
    const prismaItem = await prisma.item.create({
      data: validatedData,
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    })

    await logActivity("ITEM_CREATED", `New item created: ${prismaItem.itemName} (ID: ${prismaItem.id})`)

    revalidatePath("/admin/item")
    return { item: convertPrismaItemToItem(prismaItem as PrismaItem) }
  } catch (error) {
    console.error("Failed to create item:", error)
    return { error: "Failed to create item" }
  }
}

export async function updateItem(
  formData: FormData,
): Promise<{ item: Item } | { error: string; errors?: Record<string, string[]> }> {
  const itemData = {
    id: Number(formData.get("id")),
    partNo: formData.get("partNo") as string | null,
    itemName: formData.get("itemName") as string,
    model: formData.get("model") as string | null,
    categoryId: Number(formData.get("categoryId")),
    listPrice: Number(formData.get("listPrice")),
    sellingPrice: Number(formData.get("sellingPrice")),
    amcPrice: formData.get("amcPrice") ? Number(formData.get("amcPrice")) : null,
    nonAmcPrice: formData.get("nonAmcPrice") ? Number(formData.get("nonAmcPrice")) : null,
    priceValidTill: formData.get("priceValidTill") ? new Date(formData.get("priceValidTill") as string) : null,
  }

  const validationResult = itemSchema.safeParse(itemData)

  if (!validationResult.success) {
    console.error("Validation failed:", validationResult.error.errors)
    return {
      error: "Validation failed",
      errors: validationResult.error.flatten().fieldErrors,
    }
  }

  const validatedData = validationResult.data

  try {
    const updatedPrismaItem = await prisma.item.update({
      where: { id: itemData.id },
      data: validatedData,
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    })

    await logActivity("ITEM_UPDATED", `Item updated: ${updatedPrismaItem.itemName} (ID: ${updatedPrismaItem.id})`)

    revalidatePath("/admin/item")
    return { item: convertPrismaItemToItem(updatedPrismaItem as PrismaItem) }
  } catch (error) {
    console.error("Failed to update item:", error)
    return { error: "Failed to update item" }
  }
}

export async function deleteItem(id: number): Promise<{ success: true } | { error: string }> {
  try {
    const item = await prisma.item.delete({
      where: { id },
    });

    await logActivity(
      "ITEM_DELETED",
      `Item deleted: ${item.itemName} (ID: ${item.id})`
    );

    revalidatePath("/admin/item");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete item:", error);
    return { error: "Failed to delete item" };
  }
}

export async function getItemById(id: number): Promise<{ item: Item } | { error: string }> {
  try {
    const prismaItem = await prisma.item.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });
    if (!prismaItem) {
      return { error: "Item not found" };
    }
    return { item: convertPrismaItemToItem(prismaItem) };
  } catch (error) {
    console.error("Failed to fetch item:", error);
    return { error: "Failed to fetch item" };
  }
}

export async function getCategories(): Promise<{ categories: Category[] } | { error: string }> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return { categories };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { error: "Failed to fetch categories" };
  }
}