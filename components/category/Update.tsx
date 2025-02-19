import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit } from 'lucide-react'

interface Category {
  id: number;
  name: string;
}

interface CategoryUpdateDialogProps {
  category: Category;
  onUpdate: (id: number, name: string) => void;
}

export function CategoryUpdateDialog({ category, onUpdate }: CategoryUpdateDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [updateCategoryName, setUpdateCategoryName] = useState(category.name)

  const handleUpdate = () => {
    if (updateCategoryName.trim()) {
      onUpdate(category.id, updateCategoryName.trim())
      setIsOpen(false)
    }
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setIsOpen(true)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={updateCategoryName}
                onChange={(e) => setUpdateCategoryName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}