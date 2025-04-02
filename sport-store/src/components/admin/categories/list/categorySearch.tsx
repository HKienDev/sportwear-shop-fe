import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CategorySearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function CategorySearch({ searchQuery, onSearchChange, onSubmit }: CategorySearchProps) {
  return (
    <form onSubmit={onSubmit} className="relative group w-full sm:w-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-[clamp(0.875rem,1.5vw,1.25rem)] h-[clamp(0.875rem,1.5vw,1.25rem)]" />
      <Input
        type="text"
        placeholder="Tìm kiếm danh mục..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9 sm:pl-10 text-[clamp(0.75rem,1.5vw,1rem)] w-full sm:w-[clamp(200px,30vw,400px)]"
      />
    </form>
  );
}
