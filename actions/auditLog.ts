// src/actions/auditLog.ts
"use server";

import { prisma } from "@/lib/prisma";
import { AuditLog, User } from "@prisma/client";

export type AuditLogWithUser = AuditLog & { user: User };

export interface FilterOptions {
  userIds: number[];
  action: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  page: number;
}

export async function getAuditLogs(filters: FilterOptions): Promise<{ logs: AuditLogWithUser[], totalPages: number }> {
  const { userIds, action, startDate, endDate, page } = filters;
  const pageSize = 20;

  const where: any = {};

  if (userIds.length > 0) {
    where.userId = { in: userIds };
  }

  if (action) {
    where.action = action;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }

  try {
    const [logs, totalCount] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.auditLog.count({ where })
    ]);

    return {
      logs: logs || [],
      totalPages: Math.ceil(totalCount / pageSize)
    };
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return { logs: [], totalPages: 0 };
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    return await prisma.user.findMany({ orderBy: { username: 'asc' } });
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getUniqueActions(): Promise<string[]> {
  try {
    const actions = await prisma.auditLog.findMany({
      select: { action: true },
      distinct: ['action'],
    });
    return actions.map(a => a.action);
  } catch (error) {
    console.error("Error fetching unique actions:", error);
    return [];
  }
}