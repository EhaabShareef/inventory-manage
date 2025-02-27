import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QuoteCategory } from "@prisma/client"

interface QuoteSearchProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  category: QuoteCategory | null
  onCategoryChange: (value: QuoteCategory | null) => void
}

export function QuoteSearch({ searchTerm, onSearchChange, category, onCategoryChange }: QuoteSearchProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 w-full">
      <Input
        placeholder="Search quotes..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full sm:w-[300px] md:w-[400px] lg:w-[500px]"
      />
      <Select
        value={category || "ALL"}
        onValueChange={(value) => onCategoryChange(value === "ALL" ? null : (value as QuoteCategory))}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Categories</SelectItem>
          {Object.values(QuoteCategory).map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

