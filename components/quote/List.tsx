import { useState } from "react"
import type { QuoteWithClientAndItems as Quote } from "@/types/quote"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronUp, Edit } from "lucide-react"
import { QuoteStatusUpdate } from "./StatusUpdate"
import { DeleteQuote } from "./Delete"
import { UpdateQuoteForm } from "./Update"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { parsePrice } from "@/lib/utils"

interface QuoteListProps {
  quotes: Quote[]
  onQuoteUpdated: () => void
  onQuoteDeleted: () => void
}

export function QuoteList({ quotes, onQuoteUpdated, onQuoteDeleted }: QuoteListProps) {
  const [expandedQuotes, setExpandedQuotes] = useState<number[]>([])
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedQuotes((prev) => (prev.includes(id) ? prev.filter((quoteId) => quoteId !== id) : [...prev, id]))
  }

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString()
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Resort Name</TableHead>
            <TableHead>Quote Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Next Follow Up</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes
            .flatMap((quote) => [
              <TableRow key={`quote-${quote.id}`}>
                <TableCell>{quote.resortName}</TableCell>
                <TableCell>{formatDate(quote.quotedDate)}</TableCell>
                <TableCell>{quote.quoteCategory}</TableCell>
                <TableCell>
                  <QuoteStatusUpdate quoteId={quote.id} currentStatus={quote.status} onStatusUpdated={onQuoteUpdated} />
                </TableCell>
                <TableCell>{formatDate(quote.nextFollowUp)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" onClick={() => toggleExpand(quote.id)}>
                      {expandedQuotes.includes(quote.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" onClick={() => setEditingQuote(quote)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-6xl h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Quote</DialogTitle>
                        </DialogHeader>
                        {editingQuote && (
                          <UpdateQuoteForm
                            quote={editingQuote}
                            onQuoteUpdated={() => {
                              onQuoteUpdated()
                              setEditingQuote(null)
                            }}
                            onCancel={() => setEditingQuote(null)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <DeleteQuote quoteId={quote.id} onQuoteDeleted={onQuoteDeleted} />
                  </div>
                </TableCell>
              </TableRow>,
              expandedQuotes.includes(quote.id) && (
                <TableRow key={`quote-details-${quote.id}`}>
                  <TableCell colSpan={6}>
                    <Table>
                      <TableHeader>
                        <TableRow className="text-xs">
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
                        {quote.items.map((item) => (
                          <TableRow key={`quote-item-${quote.id}-${item.id}`} className="text-xs">
                            <TableCell>{item.item.itemName}</TableCell>
                            <TableCell>{item.item.partNo}</TableCell>
                            <TableCell>{item.item.category.name}</TableCell>
                            <TableCell>{parsePrice(item.item.listPrice)}</TableCell>
                            <TableCell>{parsePrice(item.item.sellingPrice)}</TableCell>
                            <TableCell>{item.item.amcPrice ? parsePrice(item.item.amcPrice) : "N/A"}</TableCell>
                            <TableCell>{item.item.nonAmcPrice ? parsePrice(item.item.nonAmcPrice) : "N/A"}</TableCell>
                            <TableCell>{formatDate(item.item.priceValidTill)}</TableCell>
                            <TableCell>{parsePrice(item.amount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              ),
            ])
            .filter(Boolean)}
        </TableBody>
      </Table>
    </>
  )
}

