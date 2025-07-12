import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage = 10,
  totalItems = 0 
}: PaginationProps) {
  const delta = 2;

  const getPageNumbers = () => {
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    if (totalPages > 1) {
      range.unshift(1);
      range.push(totalPages);
    }

    return range;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Temporarily show pagination for testing
  // if (totalPages <= 1) return null;

  return (
    <div className="relative">
      {/* Glass Morphism Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-2xl transform rotate-1"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-2xl transform -rotate-1"></div>
      
      {/* Main Container */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 shadow-lg p-6">
        <div className="hidden sm:flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Info Section */}
          <div className="text-sm text-slate-600 hidden sm:block">
            <span className="font-medium text-slate-800">
              {startItem.toLocaleString()}
            </span>
            {" - "}
            <span className="font-medium text-slate-800">
              {endItem.toLocaleString()}
            </span>
            {" trong "}
            <span className="font-medium text-slate-800">
              {totalItems.toLocaleString()}
            </span>
            {" kết quả"}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative group transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-0.5 transition-transform duration-200" />
              Trước
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {pageNumbers.map((page, index) =>
                page === "..." ? (
                  <div
                    key={`ellipsis-${index}`}
                    className="flex items-center justify-center w-10 h-10 text-slate-400"
                  >
                    <MoreHorizontal size={16} />
                  </div>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(Number(page))}
                    className={`w-10 h-10 p-0 transition-all duration-300 hover:scale-105 ${
                      currentPage === page 
                        ? "bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-lg shadow-indigo-500/25" 
                        : "hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative group transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
              <ChevronRight size={16} className="ml-1 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Button>
          </div>

          {/* Page Info */}
          <div className="text-sm text-slate-500 font-medium hidden sm:block">
            Trang {currentPage} / {totalPages}
          </div>
        </div>

        {/* Mobile Pagination */}
        <div className="block sm:hidden mt-2 pt-2 border-t border-slate-200/60">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex-1 mr-2"
            >
              <ChevronLeft size={16} className="mr-1" />
              Trước
            </Button>
            
            <div className="text-sm text-slate-600 font-medium">
              {currentPage} / {totalPages}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex-1 ml-2"
            >
              Sau
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}