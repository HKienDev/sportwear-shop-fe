import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CustomerSearchProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: {
    status: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
  }) => void;
}

export function CustomerSearch({
  onSearch,
  onFilterChange,
}: CustomerSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc" as const,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch]);

  const handleFilterChange = (
    key: keyof typeof filters,
    value: string
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      status: "all",
      sortBy: "createdAt",
      sortOrder: "desc" as const,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "flex items-center space-x-2",
                Object.values(filters).some((value) => value !== "all") &&
                  "border-primary"
              )}
            >
              <Filter className="h-4 w-4" />
              <span>Bộ lọc</span>
              {Object.values(filters).some((value) => value !== "all") && (
                <Badge
                  variant="secondary"
                  className="ml-2 rounded-sm px-1 font-normal"
                >
                  {Object.values(filters).filter((value) => value !== "all")
                    .length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Trạng thái</h4>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium leading-none">Sắp xếp theo</h4>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange("sortBy", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tiêu chí" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Ngày tham gia</SelectItem>
                    <SelectItem value="name">Tên</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium leading-none">Thứ tự</h4>
                <Select
                  value={filters.sortOrder}
                  onValueChange={(value: "asc" | "desc") =>
                    handleFilterChange("sortOrder", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thứ tự" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Giảm dần</SelectItem>
                    <SelectItem value="asc">Tăng dần</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={clearFilters}
              >
                Xóa bộ lọc
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {searchQuery && (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Search className="h-4 w-4" />
          <span>
            Đang tìm kiếm: <span className="font-medium">{searchQuery}</span>
          </span>
        </div>
      )}
    </div>
  );
} 