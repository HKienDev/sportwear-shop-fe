import { Search } from "lucide-react";

interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ProductSearch({ searchQuery, onSearchChange, onSubmit }: ProductSearchProps) {
  return (
    <form onSubmit={onSubmit} className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Tìm kiếm theo tên sản phẩm hoặc mã SKU (không phân biệt hoa/thường)..."
        className="pl-10 pr-4 py-2 border rounded-lg w-72"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </form>
  );
}