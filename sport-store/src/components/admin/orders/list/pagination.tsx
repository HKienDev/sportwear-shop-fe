import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
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

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100 sm:px-8">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-600">
            Hiển thị <span className="font-semibold text-gray-900">{Math.min((currentPage - 1) * 10 + 1, totalPages * 10)}</span> đến{' '}
            <span className="font-semibold text-gray-900">{Math.min(currentPage * 10, totalPages * 10)}</span> trên{' '}
            <span className="font-semibold text-gray-900">{totalPages * 10}</span> kết quả
          </p>
        </div>
        <nav className="inline-flex items-center -space-x-px rounded-lg shadow-sm" aria-label="Pagination">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span className="sr-only">Trang trước</span>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-200"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(Number(page))}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border transition-all duration-200 ${
                  currentPage === page
                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span className="sr-only">Trang sau</span>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
}