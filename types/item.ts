import type { z } from "zod"
import type { itemSchema } from "@/schemas/item"
import type { Decimal } from "@prisma/client/runtime/library"

export type ItemFormData = z.infer<typeof itemSchema>

export interface Category {
  id: number
  name: string
}

export interface Item extends Omit<ItemFormData, "categoryId"> {
  id: number
  category: Category
  createdAt: Date
  updatedAt: Date
}

export interface PrismaItem extends Omit<Item, "listPrice" | "sellingPrice" | "amcPrice" | "nonAmcPrice" > {
  listPrice: Decimal
  sellingPrice: Decimal
  amcPrice: Decimal | null
  nonAmcPrice: Decimal | null
  categoryId: number
}