import { Button } from "@/components/ui/button"
import { Trash } from 'lucide-react'
import { Client } from "@/types/client"

interface ClientDeleteButtonProps {
  client: Client;
  onDelete: (id: number) => void;
}

export function ClientDeleteButton({ client, onDelete }: ClientDeleteButtonProps) {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete the client "${client.resortName}"?`)) {
      onDelete(client.id)
    }
  }

  return (
    <Button variant="ghost" onClick={handleDelete}>
      <Trash className="h-4 w-4" />
    </Button>
  )
}