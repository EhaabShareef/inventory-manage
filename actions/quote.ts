"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { Quote, QuoteCategory } from "@/types/quote"
import type { Prisma, QuoteStatus } from "@prisma/client"
import { logActivity } from "@/lib/audit-logger"
import { quoteFormSchema, type QuoteFormData } from "@/schemas/quote"
import { convertPrismaQuoteToQuote } from "@/lib/converters"

export async function getQuotes(
  search = "",
  category: QuoteCategory | null | undefined,
  page = 1,
  pageSize = 10,
): Promise<{ quotes: Quote[]; totalCount: number; totalPages: number } | { error: string }> {
  try {
    const where: Prisma.QuoteWhereInput = {
      AND: [
        category ? { quoteCategory: category } : {},
        {
          OR: [{ resortName: { contains: search } }, { client: { companyName: { contains: search } } }],
        },
      ],
    }

    const [prismaQuotes, totalCount] = await Promise.all([
      prisma.quote.findMany({
        where,
        include: {
          client: true,
          items: {
            include: {
              item: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
        orderBy: { quotedDate: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.quote.count({ where }),
    ])

    const quotes = prismaQuotes.map(convertPrismaQuoteToQuote)

    return {
      quotes,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    }
  } catch (error) {
    console.error("Failed to fetch quotes:", error)
    return { error: "Failed to fetch quotes" }
  }
}

export async function createQuote(data: QuoteFormData): Promise<{ quote: Quote } | { error: string }> {
  const validationResult = quoteFormSchema.safeParse(data)

  if (!validationResult.success) {
    return { error: "Validation failed: " + validationResult.error.message }
  }

  const validatedData = validationResult.data

  try {
    const prismaQuote = await prisma.quote.create({
      data: {
        resortName: validatedData.resortName,
        quotedDate: new Date(validatedData.quotedDate),
        quoteCategory: validatedData.quoteCategory,
        nextFollowUp: new Date(validatedData.nextFollowUp),
        status: validatedData.status,
        remarks: validatedData.remarks,
        items: {
          create: validatedData.items.map((item) => ({
            itemId: item.itemId,
            amount: item.amount,
          })),
        },
      },
      include: {
        client: true,
        items: {
          include: {
            item: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    const quote = convertPrismaQuoteToQuote(prismaQuote)

    await logActivity("QUOTE_CREATED", `New quote created for ${quote.resortName} (ID: ${quote.id})`)

    revalidatePath("/admin/quote")
    return { quote }
  } catch (error) {
    console.error("Failed to create quote:", error)
    return { error: "Failed to create quote" }
  }
}

export async function updateQuote(id: number, data: QuoteFormData): Promise<{ success: true } | { error: string }> {
  const validationResult = quoteFormSchema.safeParse(data)

  if (!validationResult.success) {
    return { error: "Validation failed: " + validationResult.error.message }
  }

  const validatedData = validationResult.data

  try {
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        resortName: validatedData.resortName,
        quotedDate: new Date(validatedData.quotedDate),
        quoteCategory: validatedData.quoteCategory,
        nextFollowUp: new Date(validatedData.nextFollowUp),
        status: validatedData.status,
        remarks: validatedData.remarks,
        items: {
          deleteMany: {},
          create: validatedData.items.map((item) => ({
            itemId: item.itemId,
            amount: item.amount,
          })),
        },
      },
    })

    await logActivity("QUOTE_UPDATED", `Quote updated for ${updatedQuote.resortName} (ID: ${updatedQuote.id})`)

    revalidatePath("/admin/quote")
    return { success: true }
  } catch (error) {
    console.error("Failed to update quote:", error)
    return { error: "Failed to update quote" }
  }
}

export async function deleteQuote(id: number): Promise<{ success: true } | { error: string }> {
  try {
    const quote = await prisma.quote.delete({
      where: { id },
      include: {
        items: true,
      },
    })

    await logActivity("QUOTE_DELETED", `Quote deleted for ${quote.resortName} (ID: ${quote.id})`)

    revalidatePath("/admin/quote")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete quote:", error)
    return { error: "Failed to delete quote" }
  }
}

export async function getQuoteById(id: number): Promise<{ quote: Quote } | { error: string }> {
  try {
    const prismaQuote = await prisma.quote.findUnique({
      where: { id },
      include: {
        client: true,
        items: {
          include: {
            item: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    if (!prismaQuote) {
      return { error: "Quote not found" }
    }

    const quote = convertPrismaQuoteToQuote(prismaQuote)
    return { quote }
  } catch (error) {
    console.error("Failed to fetch quote:", error)
    return { error: "Failed to fetch quote" }
  }
}

export async function updateQuoteStatus(
  id: number,
  status: QuoteStatus,
): Promise<{ quote: Quote } | { error: string }> {
  try {
    const updatedPrismaQuote = await prisma.quote.update({
      where: { id },
      data: { status },
      include: {
        client: true,
        items: {
          include: {
            item: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })

    const updatedQuote = convertPrismaQuoteToQuote(updatedPrismaQuote)

    await logActivity(
      "QUOTE_STATUS_UPDATED",
      `Quote status updated for ${updatedQuote.resortName} (ID: ${updatedQuote.id}) to ${status}`,
    )

    revalidatePath("/admin/quote")
    return { quote: updatedQuote }
  } catch (error) {
    console.error("Failed to update quote status:", error)
    return { error: "Failed to update quote status" }
  }
}