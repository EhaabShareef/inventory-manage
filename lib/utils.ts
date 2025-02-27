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

export const parsePrice = (price: number | null): string => {
  return price !== null ? price.toFixed(2) : 'N/A';
};

export function parseDate(date: Date): string {
  const d = new Date(date)

  const day = d.getDate().toString().padStart(2, "0")
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase()
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, "0")
  const minutes = d.getMinutes().toString().padStart(2, "0")

  return `${day}-${month}-${year} ${hours}:${minutes}`
}