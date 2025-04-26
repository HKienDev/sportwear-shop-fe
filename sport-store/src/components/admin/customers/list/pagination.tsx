import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex flex-wrap justify-between items-center">
      <div className="text-sm text-slate-600 mb-2 sm:mb-0">
        Trang <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg flex items-center justify-center ${
            currentPage === 1
              ? "text-slate-300 cursor-not-allowed bg-slate-50"
              : "text-slate-700 hover:bg-teal-50 bg-white border border-slate-200"
          }`}
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageToShow;
          if (totalPages <= 5) {
            pageToShow = i + 1;
          } else if (currentPage <= 3) {
            pageToShow = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageToShow = totalPages - 4 + i;
          } else {
            pageToShow = currentPage - 2 + i;
          }
          return (
            <button
              key={pageToShow}
              onClick={() => onPageChange(pageToShow)}
              className={`w-10 h-10 rounded-lg text-center ${
                currentPage === pageToShow
                  ? "bg-teal-500 text-white font-medium"
                  : "text-slate-600 hover:bg-teal-50 bg-white border border-slate-200"
              }`}
            >
              {pageToShow}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg flex items-center justify-center ${
            currentPage === totalPages
              ? "text-slate-300 cursor-not-allowed bg-slate-50"
              : "text-slate-700 hover:bg-teal-50 bg-white border border-slate-200"
          }`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
} 