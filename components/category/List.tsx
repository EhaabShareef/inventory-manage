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
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[150px] text-right">Item Count</TableHead>
            <TableHead className="w-[200px] text-right">Created At</TableHead>
            <TableHead className="w-[200px] text-right">Updated At</TableHead>
            <TableHead className="w-[150px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell className="text-right">{category._count.items}</TableCell>
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

