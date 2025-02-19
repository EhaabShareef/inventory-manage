import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ItemUpdateDialog } from "./Update"
import { ItemDeleteButton } from "./Delete"
import { Item, Category, ItemFormData } from "@/types/inventory"
import { parsePrice, parseDate } from "@/lib/utils"
import { AlertTriangle } from 'lucide-react'

interface ItemListProps {
  items: Item[];
  categories: Category[];
  onUpdate: (id: number, data: Partial<ItemFormData>) => void;
  onDelete: (id: number) => void;
}

export function ItemList({ items, categories, onUpdate, onDelete }: ItemListProps) {
  const isPriceExpired = (priceValidTill: string | null) => {
    if (!priceValidTill) return false;
    const validDate = new Date(priceValidTill);
    const currentDate = new Date();
    return validDate < currentDate;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">#</TableHead>
          <TableHead>Part No</TableHead>
          <TableHead>Item Name</TableHead>
          <TableHead>Model</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>List Price</TableHead>
          <TableHead>Selling Price</TableHead>
          <TableHead>AMC Price</TableHead>
          <TableHead>Non-AMC Price</TableHead>
          <TableHead>Price Valid Till</TableHead>
          <TableHead>Actions</TableHead>
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
            <TableCell>{item.partNo}</TableCell>
            <TableCell>{item.itemName}</TableCell>
            <TableCell>{item.model}</TableCell>
            <TableCell>{item.category.name}</TableCell>
            <TableCell className="text-center">{parsePrice(item.listPrice)}</TableCell>
            <TableCell className="text-center">{parsePrice(item.sellingPrice)}</TableCell>
            <TableCell className="text-center">{parsePrice(item.amcPrice)}</TableCell>
            <TableCell className="text-center">{parsePrice(item.nonAmcPrice)}</TableCell>
            <TableCell>{formatDate(item.priceValidTill)}</TableCell>
            <TableCell>
              <ItemUpdateDialog item={item} categories={categories} onUpdate={onUpdate} />
              <ItemDeleteButton item={item} onDelete={onDelete} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}