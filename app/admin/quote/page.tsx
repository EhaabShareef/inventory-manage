"use client"

import { useState, useEffect, useCallback } from "react"
import { QuoteList } from "@/components/quote/List"
import { QuoteCreateDialog } from "@/components/quote/Create"
import { QuoteSearch } from "@/components/quote/Search"
import { getQuotes } from "@/actions/quote"
import type { Quote, QuoteWithClientAndItems } from "@/types/quote"
import type { QuoteCategory } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function QuotePage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [quotesWithItems, setQuotesWithItems] = useState<QuoteWithClientAndItems[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState<QuoteCategory | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const pageSize = 10

  const fetchQuotes = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getQuotes(searchTerm, category, currentPage, pageSize)
      if ("quotes" in result) {
        setQuotes(result.quotes)
        setQuotesWithItems(result.quotes as QuoteWithClientAndItems[])
        setTotalPages(result.totalPages)
      } else {
        toast.error("Failed to fetch quotes", { description: result.error })
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, category, currentPage])

  useEffect(() => {
    fetchQuotes()
  }, [fetchQuotes])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleCategoryChange = (value: QuoteCategory | null) => {
    setCategory(value)
    setCurrentPage(1)
  }

  const handleQuoteUpdated = () => {
    fetchQuotes()
  }

  const handleQuoteDeleted = () => {
    fetchQuotes()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quotes</h1>
      <div className="flex justify-between items-center mb-4">
        <QuoteSearch
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value)
            setCurrentPage(1)
          }}
          category={category}
          onCategoryChange={handleCategoryChange}
        />
        <QuoteCreateDialog onQuoteCreated={fetchQuotes} />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <QuoteList quotes={quotesWithItems} onQuoteUpdated={handleQuoteUpdated} onQuoteDeleted={handleQuoteDeleted} />
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

