import { QuoteStatus as PrismaQuoteStatus, QuoteCategory as PrismaQuoteCategory } from '@prisma/client';
import { Client } from './client';
import { Item } from './inventory';

export { PrismaQuoteStatus as QuoteStatus, PrismaQuoteCategory as QuoteCategory };

export interface Quote {
  id: number;
  resortName: string;
  client: Client;
  quotedDate: Date;
  quoteCategory: PrismaQuoteCategory;
  nextFollowUp: Date;
  status: PrismaQuoteStatus;
  remarks: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: QuoteItem[];
}

export interface QuoteItem {
  id: number;
  quoteId: number;
  itemId: number;
  amount: number;
  item: Item;
}

export interface QuoteFormData {
  resortName: string;
  quotedDate?: string;
  quoteCategory: PrismaQuoteCategory;
  nextFollowUp?: string;
  status?: PrismaQuoteStatus;
  remarks?: string;
  items: {
    itemId: number;
    amount: number;
  }[];
}