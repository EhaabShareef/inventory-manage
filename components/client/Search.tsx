import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface ClientSearchProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onRefresh: () => void
}

export function ClientSearch({ searchTerm, onSearchChange, onRefresh }: ClientSearchProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4 w-full">
      <div className="relative flex-grow">
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pr-10" // Add right padding for potential clear button
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        )}
      </div>
      <Button onClick={onRefresh} variant="ghost" size="icon" className="shrink-0">
        <RefreshCw className="h-4 w-4" />
        <span className="sr-only">Refresh</span>
      </Button>
    </div>
  )
}

