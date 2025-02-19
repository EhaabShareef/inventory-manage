import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from 'lucide-react'
import { Category, ItemFormData } from "@/types/inventory"

interface ItemCreateDialogProps {
  onCreate: (data: ItemFormData) => void;
  categories: Category[];
}

export function ItemCreateDialog({ onCreate, categories }: ItemCreateDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<ItemFormData>({
    partNo: '',
    itemName: '',
    model: '',
    categoryId: '',
    listPrice: '',
    sellingPrice: '',
    amcPrice: '',
    nonAmcPrice: '',
    priceValidTill: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    onCreate(formData)
    setIsOpen(false)
    setFormData({
      partNo: '',
      itemName: '',
      model: '',
      categoryId: '',
      listPrice: '',
      sellingPrice: '',
      amcPrice: '',
      nonAmcPrice: '',
      priceValidTill: '',
    })
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Add Item
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="partNo" className="text-right">Part No</Label>
              <Input id="partNo" name="partNo" value={formData.partNo} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itemName" className="text-right">Item Name</Label>
              <Input id="itemName" name="itemName" value={formData.itemName} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">Model</Label>
              <Input id="model" name="model" value={formData.model} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryId" className="text-right">Category</Label>
              <Select value={formData.categoryId} onValueChange={(value) => handleSelectChange('categoryId', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="listPrice" className="text-right">List Price</Label>
              <Input id="listPrice" name="listPrice" type="number" value={formData.listPrice} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sellingPrice" className="text-right">Selling Price</Label>
              <Input id="sellingPrice" name="sellingPrice" type="number" value={formData.sellingPrice} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amcPrice" className="text-right">AMC Price</Label>
              <Input id="amcPrice" name="amcPrice" type="number" value={formData.amcPrice} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nonAmcPrice" className="text-right">Non-AMC Price</Label>
              <Input id="nonAmcPrice" name="nonAmcPrice" type="number" value={formData.nonAmcPrice} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priceValidTill" className="text-right">Price Valid Till</Label>
              <Input id="priceValidTill" name="priceValidTill" type="date" value={formData.priceValidTill} onChange={handleChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}