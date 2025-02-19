'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from './auth';

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

export async function getCategories(search: string = '') {
  try {
    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: search,
        },
      },
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })
    return { categories }
  } catch (error) {
    return { error: 'Failed to fetch categories' }
  }
}

export async function createCategory(name: string) {
  try {
    const category = await prisma.category.create({
      data: { name },
    })
    
    await logActivity(
      "CATEGORY_CREATED",
      `New category created: ${category.name} (ID: ${category.id})`
    );

    revalidatePath('/admin/category')
    return { category }
  } catch (error) {
    return { error: 'Failed to create category' }
  }
}

export async function updateCategory(id: number, name: string) {
  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    })
    
    await logActivity(
      "CATEGORY_UPDATED",
      `Category updated: ${category.name} (ID: ${category.id})`
    );

    revalidatePath('/admin/category')
    return { category }
  } catch (error) {
    return { error: 'Failed to update category' }
  }
}

export async function deleteCategory(id: number) {
  try {
    const category = await prisma.category.delete({
      where: { id },
    })
    
    await logActivity(
      "CATEGORY_DELETED",
      `Category deleted: ${category.name} (ID: ${category.id})`
    );

    revalidatePath('/admin/category')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete category' }
  }
}