// app/lib/audit-logger.ts
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/auth";

export async function logActivity(action: string, details: string) {
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