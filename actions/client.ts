"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Client, ClientFormData } from "@/types/client";
import { getCurrentUser } from "./auth";

// Helper function to log activity
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

export async function getClients(
  search: string = "",
  page: number = 1,
  pageSize: number = 10
): Promise<{ clients: Client[]; totalCount: number; totalPages: number } | { error: string }> {
  try {
    const where = {
      OR: [
        { companyName: { contains: search } },
        { resortName: { contains: search } },
        { gstTinNo: { contains: search } },
      ],
    };

    const [clients, totalCount] = await Promise.all([
      prisma.client.findMany({
        where,
        orderBy: { resortName: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.client.count({ where }),
    ]);

    return {
      clients,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return { error: "Failed to fetch clients" };
  }
}

export async function createClient(data: ClientFormData): Promise<{ client: Client } | { error: string }> {
  try {
    const client = await prisma.client.create({
      data: {
        companyName: data.companyName || null,
        resortName: data.resortName,
        gstTinNo: data.gstTinNo || null,
        itContact: data.itContact || null,
        designation: data.designation || null,
        resortContact: data.resortContact || null,
        mobileNo: data.mobileNo || null,
        email: data.email || null,
        atoll: data.atoll || null,
        maleOfficeAddress: data.maleOfficeAddress || null,
      },
    });

    await logActivity(
      "CLIENT_CREATED",
      `New client created: ${client.resortName} (ID: ${client.id})`
    );

    revalidatePath('/admin/client');
    return { client };
  } catch (error) {
    console.error('Failed to create client:', error);
    return { error: 'Failed to create client' };
  }
}

export async function updateClient(
  id: number,
  data: Partial<ClientFormData>
): Promise<{ client: Client } | { error: string }> {
  try {
    const client = await prisma.client.update({
      where: { id },
      data,
    });

    await logActivity(
      "CLIENT_UPDATED",
      `Client updated: ${client.resortName} (ID: ${client.id})`
    );

    revalidatePath("/admin/client");
    return { client };
  } catch (error) {
    console.error("Failed to update client:", error);
    return { error: "Failed to update client" };
  }
}

export async function deleteClient(id: number): Promise<{ success: true } | { error: string }> {
  try {
    const client = await prisma.client.delete({
      where: { id },
    });

    await logActivity(
      "CLIENT_DELETED",
      `Client deleted: ${client.resortName} (ID: ${client.id})`
    );

    revalidatePath("/admin/client");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete client:", error);
    return { error: "Failed to delete client" };
  }
}

export async function getClientByResortName(resortName: string): Promise<{ client: Client } | { error: string }> {
  try {
    const client = await prisma.client.findUnique({
      where: { resortName },
    });
    if (!client) {
      return { error: "Client not found" };
    }
    return { client };
  } catch (error) {
    console.error("Failed to fetch client:", error);
    return { error: "Failed to fetch client" };
  }
}