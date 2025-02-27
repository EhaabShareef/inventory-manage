"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit } from 'lucide-react'
import { toast } from "sonner"
import { updateClient } from "@/actions/client"
import { clientSchema, type ClientFormData } from "@/schemas/client"
import type { Client } from "@/types/client"
import type { ZodTypeAny } from "zod"

interface ClientUpdateDialogProps {
  client: Client
}

export function ClientUpdateDialog({ client }: ClientUpdateDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormData, string>>>({})
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const updatedData: Partial<ClientFormData> = {
      companyName: formData.get('companyName') as string | null,
      resortName: formData.get('resortName') as string,
      gstTinNo: formData.get('gstTinNo') as string | null,
      itContact: formData.get('itContact') as string | null,
      designation: formData.get('designation') as string | null,
      resortContact: formData.get('resortContact') as string | null,
      mobileNo: formData.get('mobileNo') as string | null,
      email: formData.get('email') as string | null,
      atoll: formData.get('atoll') as string | null,
      maleOfficeAddress: formData.get('maleOfficeAddress') as string | null,
    }

    try {
      const response = await updateClient(client.id, updatedData)
      if ("error" in response) {
        if (response.errors) {
          setErrors(response.errors)
        } else {
          toast.error("Error", {
            description: "Client update failed",
          })
        }
      } else {
        toast.success("Success", {
          description: "Client updated successfully",
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

  const renderLabel = (fieldName: keyof ClientFormData, labelText: string) => {
    const fieldSchema = clientSchema.shape[fieldName] as ZodTypeAny
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
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Update Client</DialogTitle>
            <p className="text-xs text-muted-foreground">
              Fields marked with <span className="text-destructive">*</span> are required
            </p>
          </DialogHeader>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            
            {/* Company, Resort & GST Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-foreground">Company & Resort Info</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  {renderLabel("companyName", "Company Name")}
                  <Input id="companyName" name="companyName" defaultValue={client.companyName || ""} />
                  {errors.companyName && <p className="text-xs text-destructive">{errors.companyName}</p>}
                </div>
                <div className="space-y-2">
                  {renderLabel("resortName", "Resort Name")}
                  <Input id="resortName" name="resortName" defaultValue={client.resortName} />
                  {errors.resortName && <p className="text-xs text-destructive">{errors.resortName}</p>}
                </div>
                <div className="space-y-2">
                  {renderLabel("gstTinNo", "GST/TIN No")}
                  <Input id="gstTinNo" name="gstTinNo" defaultValue={client.gstTinNo || ""} />
                  {errors.gstTinNo && <p className="text-xs text-destructive">{errors.gstTinNo}</p>}
                </div>
                <div className="space-y-2">
                  {renderLabel("atoll", "Atoll")}
                  <Input id="atoll" name="atoll" defaultValue={client.atoll || ""} />
                  {errors.atoll && <p className="text-xs text-destructive">{errors.atoll}</p>}
                </div>
              </div>
            </div>

            {/* IT Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-foreground">IT Department</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  {renderLabel("itContact", "Contact")}
                  <Input id="itContact" name="itContact" defaultValue={client.itContact || ""} />
                  {errors.itContact && <p className="text-xs text-destructive">{errors.itContact}</p>}
                </div>
                <div className="space-y-2">
                  {renderLabel("designation", "Designation")}
                  <Input id="designation" name="designation" defaultValue={client.designation || ""} />
                  {errors.designation && <p className="text-xs text-destructive">{errors.designation}</p>}
                </div>
              </div>
            </div>

            {/* Pickup Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-foreground">Pickup Info</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  {renderLabel("resortContact", "Resort Contact")}
                  <Input id="resortContact" name="resortContact" defaultValue={client.resortContact || ""} />
                  {errors.resortContact && <p className="text-xs text-destructive">{errors.resortContact}</p>}
                </div>
                <div className="space-y-2">
                  {renderLabel("mobileNo", "Mobile No")}
                  <Input id="mobileNo" name="mobileNo" defaultValue={client.mobileNo || ""} />
                  {errors.mobileNo && <p className="text-xs text-destructive">{errors.mobileNo}</p>}
                </div>
                <div className="space-y-2">
                  {renderLabel("email", "Email")}
                  <Input id="email" name="email" type="email" defaultValue={client.email || ""} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  {renderLabel("maleOfficeAddress", "Male Office Address")}
                  <Input
                    id="maleOfficeAddress"
                    name="maleOfficeAddress"
                    defaultValue={client.maleOfficeAddress || ""}
                  />
                  {errors.maleOfficeAddress && <p className="text-xs text-destructive">{errors.maleOfficeAddress}</p>}
                </div>
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
