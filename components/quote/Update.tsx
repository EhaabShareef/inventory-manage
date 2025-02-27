"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getItems } from "@/actions/item"
import { updateQuote } from "@/actions/quote"
import type { Item } from "@/types/item"
import { QuoteStatus, QuoteCategory } from "@prisma/client"
import { quoteFormSchema, type Quote, type QuoteFormData } from "@/schemas/quote"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

interface UpdateQuoteFormProps {
  quote: Quote
  onQuoteUpdated: () => void
  onCancel: () => void
}

export function UpdateQuoteForm({ quote, onQuoteUpdated, onCancel }: UpdateQuoteFormProps) {
  const [items, setItems] = useState<Item[]>([])
  const [quoteData, setQuoteData] = useState<QuoteFormData>({
    resortName: quote.resortName,
    quotedDate: quote.quotedDate.toISOString().split("T")[0],
    quoteCategory: quote.quoteCategory,
    nextFollowUp: quote.nextFollowUp.toISOString().split("T")[0],
    status: quote.status,
    remarks: quote.remarks || null,
    items: quote.items.map((item) => ({
      id: item.id,
      itemId: item.itemId,
      amount: item.amount,
      itemName: item.itemName,
    })),
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const result = await getItems()
    if ("items" in result) {
      setItems(result.items)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setQuoteData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setQuoteData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddItem = () => {
    if (items.length > 0) {
      setQuoteData((prev) => ({
        ...prev,
        items: [...prev.items, { itemId: items[0].id, amount: 0, itemName: items[0].itemName }],
      }))
    }
  }

  const handleItemChange = (index: number, itemId: number) => {
    const item = items.find((i) => i.id === itemId)
    if (item) {
      const newItems = [...quoteData.items]
      newItems[index] = {
        ...newItems[index],
        itemId: item.id,
        itemName: item.itemName,
      }
      setQuoteData((prev) => ({ ...prev, items: newItems }))
    }
  }

  const handleAmountChange = (index: number, amount: number) => {
    const newItems = [...quoteData.items]
    newItems[index] = { ...newItems[index], amount }
    setQuoteData((prev) => ({ ...prev, items: newItems }))
  }

  const handleRemoveItem = (index: number) => {
    setQuoteData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationResult = quoteFormSchema.safeParse(quoteData)
    if (validationResult.success) {
      const result = await updateQuote(quote.id, validationResult.data)
      if ("success" in result) {
        onQuoteUpdated()
        toast.success("Quote updated successfully")
      } else {
        console.error(result.error)
        toast.error("Failed to update quote", { description: result.error })
      }
    } else {
      console.error(validationResult.error)
      toast.error("Validation failed", { description: "Please check the form for errors" })
    }
  }

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-primary/5 p-4 rounded-md">
        <h3 className="font-bold mb-2">Quote Information</h3>
        <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1 text-sm">
          <div className="font-semibold">Resort Name:</div>
          <div>
            <Input name="resortName" value={quoteData.resortName} onChange={handleInputChange} required />
          </div>

          <div className="font-semibold">Quote Date:</div>
          <div>
            <Input name="quotedDate" type="date" value={quoteData.quotedDate} onChange={handleInputChange} required />
          </div>

          <div className="font-semibold">Category:</div>
          <div>
            <Select
              value={quoteData.quoteCategory}
              onValueChange={(value) => handleSelectChange("quoteCategory", value as QuoteCategory)}
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

          <div className="font-semibold">Next Follow Up:</div>
          <div>
            <Input
              name="nextFollowUp"
              type="date"
              value={quoteData.nextFollowUp}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="font-semibold">Status:</div>
          <div>
            <Select
              value={quoteData.status}
              onValueChange={(value) => handleSelectChange("status", value as QuoteStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(QuoteStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="font-semibold">Remarks:</div>
          <div>
            <Input name="remarks" value={quoteData.remarks || ""} onChange={handleInputChange} />
          </div>
        </div>
      </div>
      <Table>
        <TableHeader className="uppercase text-xs">
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Part No</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>List Price</TableHead>
            <TableHead>Selling Price</TableHead>
            <TableHead>AMC Price</TableHead>
            <TableHead>Non-AMC Price</TableHead>
            <TableHead>Price Valid Till</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quoteData.items.map((item, index) => {
            const selectedItem = items.find((i) => i.id === item.itemId)
            return (
              <TableRow key={index}>
                <TableCell>
                  <Select
                    value={item.itemId.toString()}
                    onValueChange={(value) => handleItemChange(index, Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((i) => (
                        <SelectItem key={i.id} value={i.id.toString()}>
                          {i.itemName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{selectedItem?.partNo}</TableCell>
                <TableCell>{selectedItem?.category.name}</TableCell>
                <TableCell>{selectedItem?.listPrice}</TableCell>
                <TableCell>{selectedItem?.sellingPrice}</TableCell>
                <TableCell>{selectedItem?.amcPrice || "N/A"}</TableCell>
                <TableCell>{selectedItem?.nonAmcPrice || "N/A"}</TableCell>
                <TableCell>{formatDate(selectedItem?.priceValidTill)}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleAmountChange(index, Number.parseFloat(e.target.value))}
                    placeholder="Amount"
                    className="w-[75px]"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <Button type="button" variant="outline" onClick={handleAddItem}>
        Add Item
      </Button>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Update Quote</Button>
      </div>
    </form>
  )
}

