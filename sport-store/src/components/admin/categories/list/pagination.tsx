interface CategoryPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  
  export default function CategoryPagination({ currentPage, totalPages, onPageChange }: CategoryPaginationProps) {
    return (
      <div className="mt-4 flex items-center justify-between">
        <div className="flex space-x-1">
          {/* Nút quay về trang trước */}
          <button
            className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {'<'}
          </button>
  
          {/* Hiển thị số trang */}
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === pageNumber 
                    ? "bg-blue-500 text-white" 
                    : "hover:bg-gray-100"
                }`}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}
  
          {/* Nút đến trang sau */}
          <button
            className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {'>'}
          </button>
        </div>
      </div>
    );
  }