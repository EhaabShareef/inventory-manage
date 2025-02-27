import type { z } from "zod"
import type { clientSchema } from "@/schemas/client"
import type { Quote } from "./quote"

export type ClientFormData = z.infer<typeof clientSchema>

export interface Client extends ClientFormData {
  id: number
  createdAt: Date
  updatedAt: Date
}

export interface PrismaClient extends Omit<Client, "createdAt" | "updatedAt"> {
  createdAt: Date
  updatedAt: Date
}

export interface ClientWithQuotes extends Client {
  quotes: Quote[]
}