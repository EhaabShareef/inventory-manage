import { Input } from "@/components/ui/input"

interface ClientSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ClientSearch({ searchTerm, onSearchChange }: ClientSearchProps) {
  return (
    <div className="flex gap-4 mb-4 w-full mr-4">
      <Input 
        placeholder="Search clients..." 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full"
      />
    </div>
  )
}