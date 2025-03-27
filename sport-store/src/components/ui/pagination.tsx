"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Tính toán các trang cần hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
  
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      }
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Nút Previous */}
      <button
        type="button"
        className={cn(
          "px-3 py-1 border rounded-md min-w-[40px] cursor-pointer",
          "hover:bg-gray-100 transition-colors duration-200",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        )}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Số trang */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page) => (
          <button
            key={page}
            type="button"
            className={cn(
              "px-3 py-1 border rounded-md min-w-[40px] cursor-pointer",
              "hover:bg-gray-100 transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              currentPage === page && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Nút Next */}
      <button
        type="button"
        className={cn(
          "px-3 py-1 border rounded-md min-w-[40px] cursor-pointer",
          "hover:bg-gray-100 transition-colors duration-200",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        )}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
} 