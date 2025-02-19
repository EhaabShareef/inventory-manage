"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { formatPrice, formatDate } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { Item, Category, ItemFormData, PrismaItem } from "@/types/inventory";
import { getCurrentUser } from "./auth";


// Helper function to log activity
async function logActivity(action: string, details: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    console.error("No current user found for activity logging");
    return;
  }

  await prisma.auditLog.create({
    data: {
      action,
      details,
      userId: currentUser.id,
    },
  });
}

function convertPrismaItemToItem(prismaItem: PrismaItem): Item {
  return {
    id: prismaItem.id,
    partNo: prismaItem.partNo,
    itemName: prismaItem.itemName,
    model: prismaItem.model,
    category: prismaItem.category,
    listPrice: prismaItem.listPrice.toNumber(),
    sellingPrice: prismaItem.sellingPrice.toNumber(),
    amcPrice: prismaItem.amcPrice?.toNumber() ?? null,
    nonAmcPrice: prismaItem.nonAmcPrice?.toNumber() ?? null,
    priceValidTill: prismaItem.priceValidTill?.toISOString() ?? null,
    createdAt: prismaItem.createdAt,
    updatedAt: prismaItem.updatedAt,
  };
}

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

export async function createItem(data: ItemFormData): Promise<{ item: Item } | { error: string }> {
  try {
    const prismaItem = await prisma.item.create({
      data: {
        partNo: data.partNo || null,
        itemName: data.itemName,
        model: data.model || null,
        category: { connect: { id: parseInt(data.categoryId) } },
        listPrice: formatPrice(data.listPrice),
        sellingPrice: formatPrice(data.sellingPrice),
        amcPrice: data.amcPrice ? formatPrice(data.amcPrice) : null,
        nonAmcPrice: data.nonAmcPrice ? formatPrice(data.nonAmcPrice) : null,
        priceValidTill: data.priceValidTill ? formatDate(data.priceValidTill) : null,
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    await logActivity(
      "ITEM_CREATED",
      `New item created: ${prismaItem.itemName} (ID: ${prismaItem.id})`
    );

    revalidatePath('/admin/item');
    return { item: convertPrismaItemToItem(prismaItem) };
  } catch (error) {
    console.error('Failed to create item:', error);
    return { error: 'Failed to create item' };
  }
}

export async function updateItem(id: number, data: Partial<ItemFormData>): Promise<{ item: Item } | { error: string }> {
  try {
    const updateData: Prisma.ItemUpdateInput = {
      partNo: data.partNo || null,
      itemName: data.itemName,
      model: data.model || null,
      priceValidTill: data.priceValidTill ? formatDate(data.priceValidTill) : null,
    };

    if (data.categoryId !== undefined) {
      updateData.category = { connect: { id: parseInt(data.categoryId) } };
    }

    if (data.listPrice !== undefined) {
      updateData.listPrice = formatPrice(data.listPrice);
    }
    if (data.sellingPrice !== undefined) {
      updateData.sellingPrice = formatPrice(data.sellingPrice);
    }
    if (data.amcPrice !== undefined) {
      updateData.amcPrice = data.amcPrice ? formatPrice(data.amcPrice) : null;
    }
    if (data.nonAmcPrice !== undefined) {
      updateData.nonAmcPrice = data.nonAmcPrice ? formatPrice(data.nonAmcPrice) : null;
    }

    const prismaItem = await prisma.item.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    await logActivity(
      "ITEM_UPDATED",
      `Item updated: ${prismaItem.itemName} (ID: ${prismaItem.id})`
    );

    revalidatePath("/admin/item");
    return { item: convertPrismaItemToItem(prismaItem) };
  } catch (error) {
    console.error("Failed to update item:", error);
    return { error: "Failed to update item" };
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