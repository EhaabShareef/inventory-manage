"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash, Loader2 } from "lucide-react"
import { deleteQuote, getQuoteById } from "@/actions/quote"
import type { Quote } from "@/types/quote"

interface DeleteQuoteProps {
  quoteId: number
  onQuoteDeleted: () => void
}

export function DeleteQuote({ quoteId, onQuoteDeleted }: DeleteQuoteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [quoteDetails, setQuoteDetails] = useState<Quote | null>(null)

  const handleOpenChange = async (open: boolean) => {
    if (open && !quoteDetails) {
      setIsLoading(true)
      const result = await getQuoteById(quoteId)
      if ("quote" in result) {
        setQuoteDetails(result.quote)
      } else {
        console.error(result.error)
      }
      setIsLoading(false)
    }
    setIsOpen(open)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await deleteQuote(quoteId)
      if ("success" in result) {
        onQuoteDeleted()
      } else {
        console.error(result.error)
      }
    } catch (error) {
      console.error("Failed to delete quote:", error)
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this quote?</AlertDialogTitle>
          <AlertDialogDescription>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : quoteDetails ? (
              <>
                <p>Quote details:</p>
                <ul className="list-disc list-inside">
                  <li>Resort: {quoteDetails.resortName}</li>
                  <li>Date: {new Date(quoteDetails.quotedDate).toLocaleDateString()}</li>
                  <li>Category: {quoteDetails.quoteCategory}</li>
                  <li>Status: {quoteDetails.status}</li>
                  <li>Items: {quoteDetails.items.length}</li>
                </ul>
                <p className="mt-2">
                  This action cannot be undone. This will permanently delete the quote and all its associated data.
                </p>
              </>
            ) : (
              <p>Failed to load quote details. Please try again.</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading || !quoteDetails}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

