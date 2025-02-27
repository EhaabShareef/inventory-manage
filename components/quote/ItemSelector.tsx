"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getItems } from "@/actions/item"
import type { Item } from "@/types/item"
import type { QuoteFormData, QuoteItemFormData } from "@/types/quote"

interface ItemSelectorProps {
  onItemsChange: (items: QuoteItemFormData[]) => void
  quoteData: QuoteFormData
}

export function ItemSelector({ onItemsChange, quoteData }: ItemSelectorProps) {
  const [items, setItems] = useState<Item[]>([])
  const [selectedItems, setSelectedItems] = useState<QuoteItemFormData[]>(quoteData.items)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    const result = await getItems()
    if ("items" in result) {
      setItems(result.items)
    }
  }

  const handleAddItem = () => {
    if (items.length > 0) {
      setSelectedItems([...selectedItems, { itemId: items[0].id, amount: 0, itemName: items[0].itemName }])
    }
  }

  const handleItemChange = (index: number, itemId: number) => {
    const item = items.find((i) => i.id === itemId)
    if (item) {
      const newSelectedItems = [...selectedItems]
      newSelectedItems[index] = {
        itemId: item.id,
        amount: newSelectedItems[index]?.amount || 0,
        itemName: item.itemName,
      }
      setSelectedItems(newSelectedItems)
      onItemsChange(newSelectedItems)
    }
  }

  const handleAmountChange = (index: number, amount: number) => {
    const newSelectedItems = [...selectedItems]
    newSelectedItems[index].amount = amount
    setSelectedItems(newSelectedItems)
    onItemsChange(newSelectedItems)
  }

  const formatDate = (date: Date | null | undefined) => {
    return date ? new Date(date).toLocaleDateString() : "N/A"
  }

  return (
    <div className="space-y-4">
      <div className="bg-primary/5 p-4 rounded-md">
        <h3 className="font-bold mb-2">Quote Information</h3>
        <div className="grid grid-cols-[auto,1fr] gap-x-2 gap-y-1 text-sm">
          <div className="font-semibold">Resort Name:</div>
          <div>{quoteData.resortName}</div>

          <div className="font-semibold">Quote Date:</div>
          <div>{quoteData.quotedDate}</div>

          <div className="font-semibold">Category:</div>
          <div>{quoteData.quoteCategory}</div>

          <div className="font-semibold">Next Follow Up:</div>
          <div>{quoteData.nextFollowUp}</div>

          <div className="font-semibold">Status:</div>
          <div>{quoteData.status}</div>

          <div className="font-semibold">Remarks:</div>
          <div>{quoteData.remarks}</div>
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedItems.map((item, index) => (
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
              <TableCell>{item.itemName}</TableCell>
              <TableCell>{items.find(i => i.id === item.itemId)?.category.name || "N/A"}</TableCell>
              <TableCell>{items.find(i => i.id === item.itemId)?.listPrice || "N/A"}</TableCell>
              <TableCell>{items.find(i => i.id === item.itemId)?.sellingPrice || "N/A"}</TableCell>
              <TableCell>{items.find(i => i.id === item.itemId)?.amcPrice || "N/A"}</TableCell>
              <TableCell>{items.find(i => i.id === item.itemId)?.nonAmcPrice || "N/A"}</TableCell>
              <TableCell>{formatDate(items.find(i => i.id === item.itemId)?.priceValidTill)}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.amount}
                  onChange={(e) => handleAmountChange(index, Number.parseFloat(e.target.value))}
                  placeholder="Amount"
                  className="w-[75px]"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button type="button" variant="outline" onClick={handleAddItem}>
        Add Item
      </Button>
    </div>
  )
}
