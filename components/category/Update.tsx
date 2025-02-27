"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit } from "lucide-react"
import type { Category } from "@/types/category"

interface CategoryUpdateDialogProps {
  category: Category
  onUpdate: (formData: FormData) => Promise<{ error?: string; errors?: Record<string, string[]> }>
}

export function CategoryUpdateDialog({ category, onUpdate }: CategoryUpdateDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append("id", category.id.toString())

    const result = await onUpdate(formData)
    if (result.errors) {
      setErrors(result.errors)
    } else {
      setIsOpen(false)
      setErrors({})
      formRef.current?.reset()
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="ghost" size="icon">
        <Edit className="h-4 w-4" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Update Category</DialogTitle>
          </DialogHeader>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-left font-medium">
                Name <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Input id="name" name="name" defaultValue={category.name} />
              {errors.name &&
                errors.name.map((error, index) => (
                  <p key={index} className="text-xs text-destructive">
                    {error}
                  </p>
                ))}
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

