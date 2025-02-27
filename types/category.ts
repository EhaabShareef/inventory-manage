import type { z } from "zod"
import type { categorySchema } from "@/schemas/category"

export type CategoryFormData = z.infer<typeof categorySchema>

export interface Category extends CategoryFormData {
  id: number
  createdAt: Date
  updatedAt: Date
}

export interface CategoryWithItemCount extends Category {
  _count: {
    items: number
  }
}

export interface PrismaCategory {
    id: number
    name: string
    description: string | null
    createdAt: Date
    updatedAt: Date
}