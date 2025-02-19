import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CategoryUpdateDialog } from "./Update"
import { CategoryDeleteButton } from "./Delete"
import { parseDate } from "@/lib/utils"

interface Category {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
      items: number;
    };
}

interface CategoryListProps {
  categories: Category[];
  onUpdate: (id: number, name: string) => void;
  onDelete: (id: number) => void;
}

export function CategoryList({ categories, onUpdate, onDelete }: CategoryListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Items Count</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>{category.id}</TableCell>
            <TableCell>{category.name}</TableCell>
            <TableCell>{category._count?.items || 0}</TableCell>
            <TableCell>{parseDate(category.createdAt)}</TableCell>
            <TableCell>{parseDate(category.updatedAt)}</TableCell>
            <TableCell>
              <CategoryUpdateDialog category={category} onUpdate={onUpdate} />
              <CategoryDeleteButton category={category} onDelete={onDelete} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}