import { ChevronLeft, ChevronRight } from "lucide-react";

interface CouponPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CouponPagination({ currentPage, totalPages, onPageChange }: CouponPaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center space-x-1">
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === pageNumber 
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white" 
                    : "hover:bg-gray-100"
                }`}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
} 