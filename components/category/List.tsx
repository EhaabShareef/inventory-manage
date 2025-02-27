import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CategoryUpdateDialog } from "./Update"
import { CategoryDeleteButton } from "./Delete"
import { parseDate } from "@/lib/utils"
import type { CategoryWithItemCount } from "@/types/category"

interface CategoryListProps {
  categories: CategoryWithItemCount[]
  onUpdate: (formData: FormData) => Promise<{ error?: string; errors?: Record<string, string[]> }>
  onDelete: (id: number) => Promise<void>
}

export function CategoryList({ categories, onUpdate, onDelete }: CategoryListProps) {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="whitespace-nowrap text-right">Item Count</TableHead>
            <TableHead className="whitespace-nowrap text-right">Created At</TableHead>
            <TableHead className="whitespace-nowrap text-right">Updated At</TableHead>
            <TableHead className="whitespace-nowrap text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium whitespace-nowrap">{category.id}</TableCell>
              <TableCell className="whitespace-nowrap">{category.name}</TableCell>
              <TableCell className="text-right whitespace-nowrap">{category._count.items}</TableCell>
              <TableCell className="text-right whitespace-nowrap">{parseDate(category.createdAt)}</TableCell>
              <TableCell className="text-right whitespace-nowrap">{parseDate(category.updatedAt)}</TableCell>
              <TableCell>
                <div className="flex justify-center space-x-2 whitespace-nowrap">
                  <CategoryUpdateDialog category={category} onUpdate={onUpdate} />
                  <CategoryDeleteButton category={category} onDelete={() => onDelete(category.id)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

