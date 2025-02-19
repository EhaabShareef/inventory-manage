"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash } from "bcrypt";
import { User, UserInput, Role } from "@/types/user";
import { getCurrentUser } from "./auth";

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

// Get all users
export async function getUsers(): Promise<{ users: User[] } | { error: string }> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return { users: users as User[] };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { error: "Failed to fetch users" };
  }
}

// Create a new user
export async function createUser(data: UserInput): Promise<{ user: User } | { error: string }> {
  try {
    const hashedPassword = await hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: data.role || Role.VIEW,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await logActivity(
      "USER_CREATED",
      `New user created : ${user.username} (UID : ${user.id}) with default role -> ${user.role}`
    );

    revalidatePath('/admin/users');
    return { user: user as User };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { error: "Failed to create user" };
  }
}

// Update a user
export async function updateUser(id: number, data: Partial<UserInput>): Promise<{ user: User } | { error: string }> {
  try {
    const updateData: Partial<UserInput> & { password?: string } = { ...data };
    if (data.password) {
      updateData.password = await hash(data.password, 10);
    }
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const updatedFields = Object.keys(data).join(", ");
    await logActivity(
      "USER_UPDATED",
      `User updated : ${user.username} (UID : ${user.id}). Fields changed: ${updatedFields}`
    );

    revalidatePath('/admin/users');
    return { user: user as User };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { error: "Failed to update user" };
  }
}

// Reset user password
export async function resetPassword(id: number, newPassword: string): Promise<{ success: true } | { error: string }> {
  try {
    const hashedPassword = await hash(newPassword, 10);
    const user = await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
      select: { username: true },
    });

    await logActivity(
      "PASSWORD_RESET",
      `Password reset for user : ${user.username} (UID: ${id})`
    );

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error("Failed to reset password:", error);
    return { error: "Failed to reset password" };
  }
}