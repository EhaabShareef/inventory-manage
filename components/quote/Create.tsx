"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { QuoteFormData } from "@/types/quote"
import { QuoteStatus, QuoteCategory } from "@prisma/client" // Import directly from Prisma
import { createQuote } from "@/actions/quote"
import { ItemSelector } from "./ItemSelector"
import type { Client } from "@/types/client"
import { getClients } from "@/actions/client"
import { toast } from "sonner"
import { quoteFormSchema } from "@/schemas/quote"

interface QuoteCreateDialogProps {
  onQuoteCreated: () => void
}

const formatDate = (date: Date | string): string => {
  if (typeof date === "string") return date
  return date.toISOString().split("T")[0]
}

export function QuoteCreateDialog({ onQuoteCreated }: QuoteCreateDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [clients, setClients] = useState<Client[]>([])
  const [quoteData, setQuoteData] = useState<QuoteFormData>({
    resortName: "",
    quotedDate: formatDate(new Date()),
    quoteCategory: QuoteCategory.OTHERS,
    nextFollowUp: formatDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
    status: QuoteStatus.QUOTED,
    remarks: "",
    items: [],
  })

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    if (quoteData.quotedDate) {
      const nextFollowUp = new Date(quoteData.quotedDate)
      nextFollowUp.setDate(nextFollowUp.getDate() + 5)
      setQuoteData((prev) => ({
        ...prev,
        nextFollowUp: formatDate(nextFollowUp),
      }))
    }
  }, [quoteData.quotedDate])

  const fetchClients = async () => {
    const result = await getClients()
    if ("clients" in result) {
      setClients(result.clients)
    } else {
      console.error(result.error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else {
      const validationResult = quoteFormSchema.safeParse(quoteData)
      if (validationResult.success) {
        const result = await createQuote(validationResult.data)
        if ("quote" in result) {
          onQuoteCreated()
          handleClose()
        } else {
          console.error(result.error)
          toast.error("Failed to create quote", { description: result.error })
        }
      } else {
        console.error(validationResult.error)
        toast.error("Validation failed", { description: "Please check the form for errors" })
      }
    }
  }

  const resetQuoteData = () => {
    setQuoteData({
      resortName: "",
      quotedDate: formatDate(new Date()),
      quoteCategory: QuoteCategory.OTHERS,
      nextFollowUp: formatDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
      status: QuoteStatus.QUOTED,
      remarks: "",
      items: [],
    })
  }

  const handleClose = () => {
    setOpen(false)
    setStep(1)
    resetQuoteData()
  }

  const handleBack = () => {
    setStep(1)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Quote</Button>
      </DialogTrigger>
      <DialogContent
        className={`
          w-full 
          max-w-[90vw] 
          sm:max-w-[${step === 1 ? "350px" : "1250px"}] 
          transition-all 
          duration-300
        `}
      >
        <DialogHeader>
          <DialogTitle>{step === 1 ? "Create New Quote" : "Add Items to Quote"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <>
              <div>
                <Label htmlFor="resortName">Resort Name</Label>
                <Select
                  value={quoteData.resortName}
                  onValueChange={(value) => setQuoteData((prev) => ({ ...prev, resortName: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select resort" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.resortName}>
                        {client.resortName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quotedDate">Quote Date</Label>
                <Input
                  id="quotedDate"
                  type="date"
                  value={quoteData.quotedDate}
                  onChange={(e) =>
                    setQuoteData((prev) => ({
                      ...prev,
                      quotedDate: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="quoteCategory">Quote Category</Label>
                <Select
                  value={quoteData.quoteCategory}
                  onValueChange={(value) =>
                    setQuoteData((prev) => ({
                      ...prev,
                      quoteCategory: value as QuoteCategory,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(QuoteCategory).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nextFollowUp">Next Follow Up</Label>
                <Input
                  id="nextFollowUp"
                  type="date"
                  value={quoteData.nextFollowUp}
                  onChange={(e) =>
                    setQuoteData((prev) => ({
                      ...prev,
                      nextFollowUp: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Input
                  id="remarks"
                  value={quoteData.remarks || ""}
                  onChange={(e) =>
                    setQuoteData((prev) => ({
                      ...prev,
                      remarks: e.target.value,
                    }))
                  }
                />
              </div>
            </>
          ) : (
            <ItemSelector
              onItemsChange={(items) => setQuoteData((prev) => ({ ...prev, items }))}
              quoteData={quoteData}
            />
          )}
          <div className="flex justify-between">
            {step === 2 && (
              <Button type="button" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button type="submit">{step === 1 ? "Next" : "Create Quote"}</Button>
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

