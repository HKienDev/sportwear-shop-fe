"use client";

import { useState, useCallback } from "react";
import CategoryTable from "@/components/admin/categories/list/categoryTable";
import "./styles.css";

interface CategoryFilters {
  status: string | null;
}

export default function CategoryListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<CategoryFilters>({
    status: null,
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = (newFilters: CategoryFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 w-full sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1400px]">
      <CategoryTable
        searchQuery={searchQuery}
        filters={filters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}