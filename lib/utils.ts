import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Prisma } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatPrice(price: number | string | Prisma.Decimal | null | undefined): Prisma.Decimal {
  if (price === null || price === undefined || price === '') {
    return new Prisma.Decimal(0)
  }
  if (typeof price === 'string') {
    price = parseFloat(price)
  }
  if (typeof price === 'number') {
    return new Prisma.Decimal(price.toFixed(2))
  }
  if (price instanceof Prisma.Decimal) {
    return price
  }
  throw new Error('Invalid price format')
}

export function formatDate(date: Date | string | null | undefined): Date | null {
  if (date === null || date === undefined) {
    return null
  }
  if (typeof date === 'string') {
    return new Date(date)
  }
  if (date instanceof Date) {
    return date
  }
  throw new Error('Invalid date format')
}

export const parsePrice = (price: number | null): string => {
  return price !== null ? price.toFixed(2) : 'N/A';
};

export function parseDate(date: Date): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}