import { z } from "zod"
import { QuoteStatus, QuoteCategory } from "@prisma/client"

// Use the Prisma-generated enums for Zod schemas
export const QuoteStatusSchema = z.nativeEnum(QuoteStatus)
export const QuoteCategorySchema = z.nativeEnum(QuoteCategory)

// QuoteItem schema
export const quoteItemSchema = z.object({
  id: z.number().int().positive(),
  quoteId: z.number().int().positive(),
  itemId: z.number().int().positive(),
  amount: z.number().positive(),
  itemName: z.string().optional(), // Add this for form handling
})

// Quote schema (for full quote data)
export const quoteSchema = z.object({
  id: z.number().int().positive(),
  resortName: z.string().min(1, "Resort name is required"),
  quotedDate: z.date(),
  quoteCategory: QuoteCategorySchema,
  nextFollowUp: z.date(),
  status: QuoteStatusSchema,
  remarks: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  items: z.array(quoteItemSchema),
})

// Schema for quote creation and update (form data)
export const quoteFormSchema = z.object({
  resortName: z.string().min(1, "Resort name is required"),
  quotedDate: z.string(), // Use string for form data
  quoteCategory: QuoteCategorySchema,
  nextFollowUp: z.string(), // Use string for form data
  status: QuoteStatusSchema,
  remarks: z.string().nullable(),
  items: z
    .array(
      z.object({
        itemId: z.number().int().positive(),
        amount: z.number().positive(),
        itemName: z.string().optional(),
      }),
    )
    .min(1, "At least one item is required"),
})

// Types
export type Quote = z.infer<typeof quoteSchema>
export type QuoteItem = z.infer<typeof quoteItemSchema>
export type QuoteFormData = z.infer<typeof quoteFormSchema>
export { QuoteStatus, QuoteCategory }

