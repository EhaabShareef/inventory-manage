"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit } from "lucide-react"
import { toast } from "sonner"
import { updateItem } from "@/actions/item"
import { itemSchema, type ItemFormData } from "@/schemas/item"
import type { Category, Item } from "@/types/item"
import type { ZodTypeAny } from "zod"

interface ItemUpdateDialogProps {
  item: Item
  categories: Category[]
}

export function ItemUpdateDialog({ item, categories }: ItemUpdateDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ItemFormData, string>>>({})
  const [formData, setFormData] = useState<ItemFormData>({
    partNo: item.partNo,
    itemName: item.itemName,
    model: item.model,
    categoryId: item.category.id,
    listPrice: item.listPrice,
    sellingPrice: item.sellingPrice,
    amcPrice: item.amcPrice,
    nonAmcPrice: item.nonAmcPrice,
    priceValidTill: item.priceValidTill ? new Date(item.priceValidTill) : null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "categoryId"
          ? Number(value)
          : ["listPrice", "sellingPrice", "amcPrice", "nonAmcPrice"].includes(name)
            ? Number(value) || null
            : name === "priceValidTill"
              ? value
                ? new Date(value)
                : null
              : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof Date) {
          formDataToSend.append(key, value.toISOString())
        } else {
          formDataToSend.append(key, value.toString())
        }
      }
    })
    formDataToSend.append("id", item.id.toString())

    try {
      const response = await updateItem(formDataToSend)
      if ("error" in response) {
        if (response.errors) {
          setErrors(response.errors)
        } else {
          toast.error("Error", {
            description: "Item update failed",
          })
        }
      } else {
        toast.success("Success", {
          description: "Item updated successfully",
        })
        setIsOpen(false)
        setErrors({})
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred",
      })
    }
  }

  const renderLabel = (fieldName: keyof ItemFormData, labelText: string) => {
    const fieldSchema = itemSchema.shape[fieldName] as ZodTypeAny
    const isRequired = !fieldSchema.isOptional() && !fieldSchema.isNullable()
    return (
      <Label htmlFor={fieldName} className="text-left font-medium">
        {labelText}
        {isRequired && <span className="text-destructive ml-0.5">*</span>}
      </Label>
    )
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="ghost" size="icon">
        <Edit className="h-4 w-4" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Update Item</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Fields marked with <span className="text-destructive">*</span> are required
            </p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                {renderLabel("partNo", "Part No")}
                <Input id="partNo" name="partNo" value={formData.partNo || ""} onChange={handleChange} />
                {errors.partNo && <p className="text-xs text-destructive">{errors.partNo}</p>}
              </div>

              <div className="space-y-2">
                {renderLabel("itemName", "Item Name")}
                <Input id="itemName" name="itemName" value={formData.itemName} onChange={handleChange} />
                {errors.itemName && <p className="text-xs text-destructive">{errors.itemName}</p>}
              </div>

              <div className="space-y-2">
                {renderLabel("model", "Model")}
                <Input id="model" name="model" value={formData.model || ""} onChange={handleChange} />
                {errors.model && <p className="text-xs text-destructive">{errors.model}</p>}
              </div>

              <div className="space-y-2">
                {renderLabel("categoryId", "Category")}
                <Select
                  name="categoryId"
                  value={formData.categoryId.toString()}
                  onValueChange={(value) => handleChange({ target: { name: "categoryId", value } } as any)}
                >
                  <SelectTrigger>
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
                {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId}</p>}
              </div>

              <div className="space-y-2">
                {renderLabel("listPrice", "List Price")}
                <Input
                  id="listPrice"
                  name="listPrice"
                  type="number"
                  step="0.01"
                  value={formData.listPrice}
                  onChange={handleChange}
                />
                {errors.listPrice && <p className="text-xs text-destructive">{errors.listPrice}</p>}
              </div>

              <div className="space-y-2">
                {renderLabel("sellingPrice", "Selling Price")}
                <Input
                  id="sellingPrice"
                  name="sellingPrice"
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                />
                {errors.sellingPrice && <p className="text-xs text-destructive">{errors.sellingPrice}</p>}
              </div>

              <div className="space-y-2">
                {renderLabel("amcPrice", "AMC Price")}
                <Input
                  id="amcPrice"
                  name="amcPrice"
                  type="number"
                  step="0.01"
                  value={formData.amcPrice || ""}
                  onChange={handleChange}
                />
                {errors.amcPrice && <p className="text-xs text-destructive">{errors.amcPrice}</p>}
              </div>

              <div className="space-y-2">
                {renderLabel("nonAmcPrice", "Non-AMC Price")}
                <Input
                  id="nonAmcPrice"
                  name="nonAmcPrice"
                  type="number"
                  step="0.01"
                  value={formData.nonAmcPrice || ""}
                  onChange={handleChange}
                />
                {errors.nonAmcPrice && <p className="text-xs text-destructive">{errors.nonAmcPrice}</p>}
              </div>

              <div className="space-y-2 sm:col-span-2">
                {renderLabel("priceValidTill", "Price Valid Till")}
                <Input
                  id="priceValidTill"
                  name="priceValidTill"
                  type="date"
                  value={formData.priceValidTill ? formData.priceValidTill.toISOString().split("T")[0] : ""}
                  onChange={handleChange}
                />
                {errors.priceValidTill && <p className="text-xs text-destructive">{errors.priceValidTill}</p>}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

