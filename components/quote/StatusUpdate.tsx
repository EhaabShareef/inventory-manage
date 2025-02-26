import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuoteStatus } from '@/types/quote'
import { updateQuoteStatus } from '@/actions/quote'

interface QuoteStatusUpdateProps {
  quoteId: number
  currentStatus: QuoteStatus
  onStatusUpdated: () => void
}

export function QuoteStatusUpdate({ quoteId, currentStatus, onStatusUpdated }: QuoteStatusUpdateProps) {
  const [status, setStatus] = useState<QuoteStatus>(currentStatus)
  const [isOpen, setIsOpen] = useState(false)

  const handleStatusChange = async (newStatus: QuoteStatus) => {
    setStatus(newStatus)
  }

  const handleSubmit = async () => {
    const result = await updateQuoteStatus(quoteId, status)
    if ('quote' in result) {
      onStatusUpdated()
    } else {
      console.error(result.error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {currentStatus}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Quote Status</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select value={status} onValueChange={(value) => handleStatusChange(value as QuoteStatus)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(QuoteStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit}>Update Status</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
