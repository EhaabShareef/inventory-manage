import { PrismaItem, Item } from "@/types/inventory";

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
    priceValidTill: prismaItem.priceValidTill?.toISOString() ?? null,
    createdAt: prismaItem.createdAt,
    updatedAt: prismaItem.updatedAt,
  };
}

// Add other converter functions here as needed for different modules