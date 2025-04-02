import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface CouponSearchProps {
    onSearch: (query: string) => void;
}

export function CouponSearch({ onSearch }: CouponSearchProps) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    type="text"
                    placeholder="Tìm kiếm mã giảm giá..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 w-[300px]"
                />
            </div>
        </form>
    );
} 