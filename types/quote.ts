import type { z } from "zod"
import type {
  quoteSchema,
  quoteItemSchema,
  QuoteStatusSchema,
  QuoteCategorySchema,
} from "@/schemas/quote"
import type { Client } from "./client"
import type { Item, Category } from "./item"

// Basic types from schemas
export type Quote = z.infer<typeof quoteSchema>
export type QuoteItem = z.infer<typeof quoteItemSchema>
export type QuoteStatus = z.infer<typeof QuoteStatusSchema>
export type QuoteCategory = z.infer<typeof QuoteCategorySchema>

// Extended types for API responses and component props
export interface QuoteWithItems extends Omit<Quote, 'items'> {
  items: (QuoteItem & { item: Item & { category: Category } })[]
}

export interface QuoteWithClient extends Quote {
  client: Client
}

export interface QuoteWithClientAndItems extends Omit<QuoteWithClient, 'items'> {
  items: (QuoteItem & { item: Item & { category: Category } })[]
}

// Form data types
export interface QuoteFormData extends Omit<Quote, "id" | "createdAt" | "updatedAt" | "quotedDate" | "nextFollowUp" | "items"> {
  quotedDate?: string
  nextFollowUp?: string
  items: QuoteItemFormData[]
}

export interface QuoteItemFormData extends Omit<QuoteItem, "id" | "quoteId"> {
  itemName: string
}

// List types for dropdowns or select inputs
export type QuoteStatusList = Array<{ value: QuoteStatus; label: string }>
export type QuoteCategoryList = Array<{ value: QuoteCategory; label: string }>

// Search params type for quote listing
export interface QuoteSearchParams {
  search?: string
  status?: QuoteStatus
  category?: QuoteCategory
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

// API response types
export interface QuoteListResponse {
  quotes: QuoteWithClientAndItems[]
  totalCount: number
  totalPages: number
}

export interface QuoteDetailResponse {
  quote: QuoteWithClientAndItems
}

