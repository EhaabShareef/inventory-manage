import { PrismaItem, Item } from "@/types/item";
import type { PrismaCategory, Category } from "@/types/category"
import type { Quote } from "@/types/quote"
import { parsePrice } from "./utils";
import { Prisma } from "@prisma/client";

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
export function convertPrismaQuoteToQuote(
  prismaQuote: Prisma.QuoteGetPayload<{
    include: {
      client: true
      items: { include: { item: { include: { category: true } } } }
    }
  }>,
): Quote {
  return {
    ...prismaQuote,
    items: prismaQuote.items.map((item) => ({
      ...item,
      amount: Number.parseFloat(parsePrice(item.amount.toNumber())),
      item: {
        ...item.item,
        listPrice: Number.parseFloat(parsePrice(item.item.listPrice.toNumber())),
        sellingPrice: Number.parseFloat(parsePrice(item.item.sellingPrice.toNumber())),
        amcPrice: item.item.amcPrice ? Number.parseFloat(parsePrice(item.item.amcPrice.toNumber())) : null,
        nonAmcPrice: item.item.nonAmcPrice ? Number.parseFloat(parsePrice(item.item.nonAmcPrice.toNumber())) : null,
        category: item.item.category,
        priceValidTill: item.item.priceValidTill ? item.item.priceValidTill.toISOString() : null,
      },
    })),
  }
}
