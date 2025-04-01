import { Search } from "lucide-react";

interface CouponSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function CouponSearch({ searchQuery, onSearchChange, onSubmit }: CouponSearchProps) {
  return (
    <form onSubmit={onSubmit} className="relative w-full sm:w-96">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm theo mã hoặc % giảm giá..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </form>
  );
}