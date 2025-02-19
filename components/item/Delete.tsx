import { Button } from "@/components/ui/button"
import { Trash } from 'lucide-react'

interface Item {
  id: number;
  itemName: string;
}

interface ItemDeleteButtonProps {
  item: Item;
  onDelete: (id: number) => void;
}

export function ItemDeleteButton({ item, onDelete }: ItemDeleteButtonProps) {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete the item "${item.itemName}"?`)) {
      onDelete(item.id)
    }
  }

  return (
    <Button variant="ghost" onClick={handleDelete}>
      <Trash className="h-4 w-4" />
    </Button>
  )
}