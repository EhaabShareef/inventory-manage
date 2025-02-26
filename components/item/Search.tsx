import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import type { Category } from "@/types/item"

interface ItemSearchProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  categories: Category[]
  onRefresh: () => void
}

export function ItemSearch({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onRefresh,
}: ItemSearchProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <Input
        placeholder="Search items . . ."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full sm:flex-1"
      />
      <div className="flex gap-2">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onRefresh} variant="ghost" size="icon" className="shrink-0">
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>
    </div>
  )
}

