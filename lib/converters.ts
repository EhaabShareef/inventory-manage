import { PrismaItem, Item } from "@/types/item";
import type { PrismaCategory, Category } from "@/types/category"

export function convertPrismaItemToItem(prismaItem: PrismaItem): Item {
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
    priceValidTill: prismaItem.priceValidTill ?? null,
    createdAt: prismaItem.createdAt,
    updatedAt: prismaItem.updatedAt,
  };
}

export function convertPrismaCategoryToCategory(prismaCategory: PrismaCategory): Category {
  return {
    id: prismaCategory.id,
    name: prismaCategory.name,
    createdAt: prismaCategory.createdAt,
    updatedAt: prismaCategory.updatedAt,
  }
}

/* PLEASE NO LONGER USE THIS OTHER THAN IN QUOTES - MAKES LIFE HARDER THAN IT SHOULD BE */