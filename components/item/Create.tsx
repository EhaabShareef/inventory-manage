"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { createItem } from "@/actions/item"
import { itemSchema, type ItemFormData } from "@/schemas/item"
import type { Category } from "@/types/item"
import type { ZodTypeAny } from "zod"

interface ItemCreateDialogProps {
  categories: Category[]
}

export function ItemCreateDialog({ categories }: ItemCreateDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ItemFormData, string>>>({})
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    try {
      const response = await createItem(formData)
      if ("error" in response) {
        if (response.errors) {
          setErrors(response.errors)
        } else {
          toast.error("Error", {
            description: "Item creation failed",
          })
        }
      } else {
        toast.success("Success", {
          description: "Item created successfully",
        })
        setIsOpen(false)
        formRef.current?.reset()
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
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Add Item
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">New Item</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Fields marked with <span className="text-destructive">*</span> are required
            </p>
          </DialogHeader>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                {renderLabel("partNo", "Part No")}
                <Input id="partNo" name="partNo" />
                {errors.partNo && <p className="text-xs text-destructive">{errors.partNo}</p>}
              </div>

              <div className="space-y-2">
                {renderLabel("itemName", "Item Name")}
                <Input id="itemName" name="itemName" />
                {errors.itemName && <p className="text-xs text-destructive">{errors.itemName}</p>}
              </div>

              <div className="space-y-2">
                {renderLabel("model", "Model")}
                <Input id="model" name="model" />
                {errors.model && <p className="text-xs text-destructive">{errors.model}</p>}
              </div>

              <div className="space-y-2">
                {renderLabel("categoryId", "Category")}
                <Select name="categoryId">
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
                <Input id="listPrice" name="listPrice" type="number" step="0.01" />
                {errors.listPrice && <p className="text-xs text-destructive">{errors.listPrice}</p>}
              </div>

              <div className="space-y-2">
                {renderLabel("sellingPrice", "Selling Price")}
                <Input id="sellingPrice" name="sellingPrice" type="number" step="0.01" />
                {errors.sellingPrice && <p className="text-xs text-destructive">{errors.sellingPrice}</p>}
              </div>

              <div className="space-y-2">
                {renderLabel("amcPrice", "AMC Price")}
                <Input id="amcPrice" name="amcPrice" type="number" step="0.01" />
                {errors.amcPrice && <p className="text-xs text-destructive">{errors.amcPrice}</p>}
              </div>

              <div className="space-y-2">
                {renderLabel("nonAmcPrice", "Non-AMC Price")}
                <Input id="nonAmcPrice" name="nonAmcPrice" type="number" step="0.01" />
                {errors.nonAmcPrice && <p className="text-xs text-destructive">{errors.nonAmcPrice}</p>}
              </div>

              <div className="space-y-2 sm:col-span-2">
                {renderLabel("priceValidTill", "Price Valid Till")}
                <Input id="priceValidTill" name="priceValidTill" type="date" />
                {errors.priceValidTill && <p className="text-xs text-destructive">{errors.priceValidTill}</p>}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

