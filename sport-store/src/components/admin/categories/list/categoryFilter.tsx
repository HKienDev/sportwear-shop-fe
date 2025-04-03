"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { useState } from "react";

interface CategoryFilterProps {
  filters: {
    status: string | null;
  };
  onFilterChange: (filters: { status: string | null }) => void;
}

const CategoryFilter = ({
  filters,
  onFilterChange,
}: CategoryFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-10">
          <Filter className="mr-2 h-4 w-4" />
          Lọc
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => {
            onFilterChange({ status: null });
            setIsOpen(false);
          }}
          className={!filters.status ? "bg-accent" : ""}
        >
          Tất cả
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onFilterChange({ status: "active" });
            setIsOpen(false);
          }}
          className={filters.status === "active" ? "bg-accent" : ""}
        >
          Hoạt động
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onFilterChange({ status: "inactive" });
            setIsOpen(false);
          }}
          className={filters.status === "inactive" ? "bg-accent" : ""}
        >
          Vô hiệu hóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryFilter; 