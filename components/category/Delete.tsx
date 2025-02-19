import { Button } from "@/components/ui/button"
import { Trash } from 'lucide-react'

interface Category {
  id: number;
  name: string;
}

interface CategoryDeleteButtonProps {
  category: Category;
  onDelete: (id: number) => void;
}

export function CategoryDeleteButton({ category, onDelete }: CategoryDeleteButtonProps) {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      onDelete(category.id)
    }
  }

  return (
    <Button variant="ghost" onClick={handleDelete}>
      <Trash className="h-4 w-4" />
    </Button>
  )
}