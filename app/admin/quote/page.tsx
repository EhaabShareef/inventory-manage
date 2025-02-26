"use client"

import { useState, useEffect, useCallback } from "react"
import { QuoteList } from "@/components/quote/List"
import { QuoteCreateDialog } from "@/components/quote/Create"
import { QuoteSearch } from "@/components/quote/Search"
import { getQuotes } from "@/actions/quote"
import type { Quote, QuoteCategory } from "@/types/quote"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function QuotePage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState<QuoteCategory | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pageSize = 10

  const fetchQuotes = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getQuotes(searchTerm, category, currentPage, pageSize)
      if ("quotes" in result) {
        setQuotes(result.quotes)
        setTotalPages(result.totalPages)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("An unexpected error occurred")
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
            setCurrentPage(1) // Reset to first page when searching
          }}
          category={category}
          onCategoryChange={handleCategoryChange}
        />
        <QuoteCreateDialog onQuoteCreated={fetchQuotes} />
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <QuoteList quotes={quotes} onQuoteUpdated={handleQuoteUpdated} onQuoteDeleted={handleQuoteDeleted} />
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

