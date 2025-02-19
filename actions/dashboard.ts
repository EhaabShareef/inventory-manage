"use server";

import { prisma } from "@/lib/prisma";
import { DashboardStats, Item } from "@/types/inventory";
import { User } from "@/types/user";
import { getCurrentUser } from "./auth";

export async function getDashboardStats(): Promise<DashboardStats> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const now = new Date();

  const [totalUsers, totalItems, totalCategories, expiredItems] = await Promise.all([
    prisma.user.count(),
    prisma.item.count(),
    prisma.category.count(),
    prisma.item.count({
      where: {
        priceValidTill: {
          lt: now,
        },
      },
    }),
  ]);

  const recentlyExpiredItems = await prisma.item.findMany({
    where: {
      priceValidTill: {
        lt: now,
        gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // Items expired in the last 7 days
      },
    },
    include: {
      category: true,
    },
    take: 5,
  });

  const formattedRecentlyExpiredItems: Item[] = recentlyExpiredItems.map(item => ({
    ...item,
    listPrice: item.listPrice.toNumber(),
    sellingPrice: item.sellingPrice.toNumber(),
    amcPrice: item.amcPrice?.toNumber() ?? null,
    nonAmcPrice: item.nonAmcPrice?.toNumber() ?? null,
    priceValidTill: item.priceValidTill?.toISOString() ?? null,
  }));

  return {
    currentUser: currentUser as User,
    totalUsers,
    totalItems,
    totalCategories,
    expiredItems,
    recentlyExpiredItems: formattedRecentlyExpiredItems,
  };
}