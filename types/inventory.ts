import { Prisma } from '@prisma/client';
import { User } from './user';

export interface Category {
  id: number;
  name: string;
}

export interface Item {
  id: number;
  partNo: string | null;
  itemName: string;
  model: string | null;
  category: Category;
  listPrice: number;
  sellingPrice: number;
  amcPrice: number | null;
  nonAmcPrice: number | null;
  priceValidTill: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemFormData {
  partNo: string;
  itemName: string;
  model: string;
  categoryId: string;
  listPrice: string;
  sellingPrice: string;
  amcPrice: string;
  nonAmcPrice: string;
  priceValidTill: string;
}

export interface DashboardStats {
  currentUser: User;
  totalUsers: number;
  totalItems: number;
  totalCategories: number;
  expiredItems: number;
  recentlyExpiredItems: Item[];
}

export type PrismaItem = Prisma.ItemGetPayload<{
  include: { category: { select: { id: true; name: true } } }
}>;