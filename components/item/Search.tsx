import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Category } from "@/types/inventory"

interface ItemSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: Category[];
}

export function ItemSearch({ searchTerm, onSearchChange, selectedCategory, onCategoryChange, categories }: ItemSearchProps) {
  return (
    <div className="flex gap-4 mb-4">
      <Input 
        placeholder="Search items..." 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-[500px]"
      />
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[180px]">
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
    </div>
  )
}