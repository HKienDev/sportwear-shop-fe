import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  
  export default function CategoryPagination({ currentPage, totalPages, onPageChange }: CategoryPaginationProps) {
    // Tính toán các trang cần hiển thị
    const getPageNumbers = () => {
      const delta = 2; // Số trang hiển thị trước và sau trang hiện tại
      const range = [];
      const rangeWithDots = [];
      let l;

      for (let i = 1; i <= totalPages; i++) {
        if (
          i === 1 || // Trang đầu
          i === totalPages || // Trang cuối
          (i >= currentPage - delta && i <= currentPage + delta) // Các trang xung quanh trang hiện tại
        ) {
          range.push(i);
        }
      }

      for (let i = 0; i < range.length; i++) {
        if (l) {
          if (range[i] - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (range[i] - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(range[i]);
        l = range[i];
      }

      return rangeWithDots;
    };

    return (
      <div className="flex items-center justify-center space-x-2">
        <button
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>

        <div className="flex items-center space-x-1">
          {getPageNumbers().map((pageNumber, index) => (
            pageNumber === '...' ? (
              <span key={`dots-${index}`} className="px-3 py-1 text-gray-500">
                {pageNumber}
              </span>
            ) : (
              <button
                key={pageNumber}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === pageNumber
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
                onClick={() => onPageChange(pageNumber as number)}
              >
                {pageNumber}
              </button>
            )
          ))}
        </div>

        <button
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>
    );
  }