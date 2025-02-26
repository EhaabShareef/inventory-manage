"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  Quote,
  QuoteFormData,
  QuoteStatus,
  QuoteCategory,
} from "@/types/quote";
import { getCurrentUser } from "./auth";
import { Prisma } from "@prisma/client";
import { formatPrice, formatDate, parsePrice } from "@/lib/utils";

async function logActivity(action: string, details: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    console.error("No current user found for activity logging");
    return;
  }

  await prisma.auditLog.create({
    data: {
      action,
      details,
      userId: currentUser.id,
    },
  });
}

function convertPrismaQuoteToQuote(
  prismaQuote: Prisma.QuoteGetPayload<{
    include: {
      client: true;
      items: { include: { item: { include: { category: true } } } };
    };
  }>
): Quote {
  return {
    ...prismaQuote,
    items: prismaQuote.items.map((item) => ({
      ...item,
      amount: parseFloat(parsePrice(item.amount.toNumber())),
      item: {
        ...item.item,
        listPrice: parseFloat(parsePrice(item.item.listPrice.toNumber())),
        sellingPrice: parseFloat(parsePrice(item.item.sellingPrice.toNumber())),
        amcPrice: item.item.amcPrice
          ? parseFloat(parsePrice(item.item.amcPrice.toNumber()))
          : null,
        nonAmcPrice: item.item.nonAmcPrice
          ? parseFloat(parsePrice(item.item.nonAmcPrice.toNumber()))
          : null,
        category: item.item.category,
        priceValidTill: item.item.priceValidTill
          ? item.item.priceValidTill.toISOString()
          : null,
      },
    })),
  };
}

export async function getQuotes(
  search: string = "",
  category: QuoteCategory | null | undefined,
  page: number = 1,
  pageSize: number = 10
): Promise<
  | { quotes: Quote[]; totalCount: number; totalPages: number }
  | { error: string }
> {
  try {
    const where: Prisma.QuoteWhereInput = {
      AND: [
        category ? { quoteCategory: category } : {},
        {
          OR: [
            { resortName: { contains: search } },
            { client: { companyName: { contains: search } } },
          ],
        },
      ],
    };

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
    ]);

    const quotes = prismaQuotes.map(convertPrismaQuoteToQuote);

    return {
      quotes,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  } catch (error) {
    console.error("Failed to fetch quotes:", error);
    return { error: "Failed to fetch quotes" };
  }
}

export async function createQuote(
  data: QuoteFormData
): Promise<{ quote: Quote } | { error: string }> {
  try {
    const prismaQuote = await prisma.quote.create({
      data: {
        resortName: data.resortName,
        quotedDate: formatDate(data.quotedDate) || new Date(),
        quoteCategory: data.quoteCategory,
        nextFollowUp:
          formatDate(data.nextFollowUp) ||
          new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: data.status || "QUOTED",
        remarks: data.remarks || null,
        items: {
          create: data.items.map((item) => ({
            itemId: item.itemId,
            amount: formatPrice(item.amount),
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
    });

    const quote = convertPrismaQuoteToQuote(prismaQuote);

    await logActivity(
      "QUOTE_CREATED",
      `New quote created for ${quote.resortName} (ID: ${quote.id})`
    );

    revalidatePath("/admin/quote");
    return { quote };
  } catch (error) {
    console.error("Failed to create quote:", error);
    return { error: "Failed to create quote" };
  }
}

export async function updateQuote(id: number, data: QuoteFormData): Promise<{ success: true } | { error: string }> {
  try {
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        resortName: data.resortName,
        quotedDate: data.quotedDate ? new Date(data.quotedDate) : undefined,
        quoteCategory: data.quoteCategory,
        nextFollowUp: data.nextFollowUp ? new Date(data.nextFollowUp) : undefined,
        status: data.status,
        remarks: data.remarks || null,
        items: {
          deleteMany: {},
          create: data.items.map((item) => ({
            itemId: item.itemId,
            amount: item.amount,
          })),
        },
      },
    })

    await logActivity("QUOTE_UPDATED", `Quote updated for ${updatedQuote.resortName} (ID: ${id})`)

    revalidatePath("/admin/quote")
    return { success: true }
  } catch (error) {
    console.error("Failed to update quote:", error)
    return { error: "Failed to update quote" }
  }
}


export async function updateQuoteStatus(
  id: number,
  status: QuoteStatus
): Promise<{ quote: Quote } | { error: string }> {
  try {
    const prismaQuote = await prisma.quote.update({
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
    });

    const quote = convertPrismaQuoteToQuote(prismaQuote);

    await logActivity(
      "QUOTE_STATUS_UPDATED",
      `Quote status updated to ${status} for ${quote.resortName} (ID: ${quote.id})`
    );

    revalidatePath("/admin/quote");
    return { quote };
  } catch (error) {
    console.error("Failed to update quote status:", error);
    return { error: "Failed to update quote status" };
  }
}

export async function deleteQuote(id: number): Promise<{ success: true } | { error: string }> {
  try {
    await prisma.quoteItem.deleteMany({
      where: { quoteId: id },
    })

    const quote = await prisma.quote.delete({
      where: { id },
      include: {
        client: true,
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

export async function getQuoteById(
  id: number
): Promise<{ quote: Quote } | { error: string }> {
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
    });
    if (!prismaQuote) {
      return { error: "Quote not found" };
    }
    const quote = convertPrismaQuoteToQuote(prismaQuote);
    return { quote };
  } catch (error) {
    console.error("Failed to fetch quote:", error);
    return { error: "Failed to fetch quote" };
  }
}
