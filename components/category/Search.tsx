import { Input } from "@/components/ui/input"

interface CategorySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function CategorySearch({ searchTerm, onSearchChange }: CategorySearchProps) {
  return (
    <div className="mb-4">
      <Input 
        placeholder="Search categories..." 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  )
}