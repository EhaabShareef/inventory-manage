import { z } from "zod"

export const itemSchema = z.object({
  partNo: z.string().nullable(),
  itemName: z.string().min(1, "Item name is required"),
  model: z.string().nullable(),
  categoryId: z.number().int().positive("Must select a valid Category"),
  listPrice: z.number().gt(0, "List price must be greater than 0"),
  sellingPrice: z.number().gt(0, "Selling price must be greater than 0"),
  amcPrice: z.number().gt(0, "AMC price must be greater than 0").nullable(),
  nonAmcPrice: z.number().gt(0, "Non-AMC price must be greater than 0").nullable(),
  priceValidTill: z
    .date()
    .nullable()
    .refine((val) => !val || val > new Date(), {
      message: "Price valid till date must be in the future",
    }),
})

export type ItemFormData = z.infer<typeof itemSchema>

