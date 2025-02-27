"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ItemUpdateDialog } from "./Update";
import { ItemDeleteButton } from "./Delete";
import type { Item, Category, ItemFormData } from "@/types/item";
import { parsePrice } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface ItemListProps {
  items: Item[];
  categories: Category[];
  onUpdate: (id: number, data: Partial<ItemFormData>) => void;
  onDelete: (id: number) => void;
}

export function ItemList({ items, categories, onDelete }: ItemListProps) {
  const isPriceExpired = (priceValidTill: Date | null) => {
    if (!priceValidTill) return false;
    const validDate = new Date(priceValidTill);
    const currentDate = new Date();
    return validDate < currentDate;
  };

  const formatDate = (dateString: Date | null): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    const day = date.getDate().toString().padStart(2, "0");
    const month = date
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  return (
    <div className="w-full overflow-auto">
      <div className="min-w-[1000px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead className="whitespace-nowrap">Part No</TableHead>
              <TableHead className="whitespace-nowrap">Item Name</TableHead>
              <TableHead className="whitespace-nowrap">Model</TableHead>
              <TableHead className="whitespace-nowrap">Category</TableHead>
              <TableHead className="whitespace-nowrap">List Price</TableHead>
              <TableHead className="whitespace-nowrap">Selling Price</TableHead>
              <TableHead className="whitespace-nowrap">AMC Price</TableHead>
              <TableHead className="whitespace-nowrap">Non-AMC Price</TableHead>
              <TableHead className="whitespace-nowrap">
                Price Valid Till
              </TableHead>
              <TableHead className="whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {isPriceExpired(item.priceValidTill) && (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.partNo}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.itemName}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.model}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item.category.name}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  {parsePrice(item.listPrice)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  {parsePrice(item.sellingPrice)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  {parsePrice(item.amcPrice)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  {parsePrice(item.nonAmcPrice)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(item.priceValidTill)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <ItemUpdateDialog item={item} categories={categories} />
                  <ItemDeleteButton item={item} onDelete={onDelete} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
