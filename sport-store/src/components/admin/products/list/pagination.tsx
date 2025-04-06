interface ProductPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  
  export default function ProductPagination({ currentPage, totalPages, onPageChange }: ProductPaginationProps) {
    // Tạo mảng các trang cần hiển thị
    const getPageNumbers = () => {
      const pageNumbers = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        // Nếu tổng số trang nhỏ hơn hoặc bằng maxVisiblePages, hiển thị tất cả
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Nếu tổng số trang lớn hơn maxVisiblePages, hiển thị một phần
        if (currentPage <= 3) {
          // Nếu đang ở đầu danh sách
          for (let i = 1; i <= 5; i++) {
            pageNumbers.push(i);
          }
        } else if (currentPage >= totalPages - 2) {
          // Nếu đang ở cuối danh sách
          for (let i = totalPages - 4; i <= totalPages; i++) {
            pageNumbers.push(i);
          }
        } else {
          // Nếu đang ở giữa danh sách
          for (let i = currentPage - 2; i <= currentPage + 2; i++) {
            pageNumbers.push(i);
          }
        }
      }
      
      return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    return (
      <div className="mt-4 flex items-center justify-between bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-700">
          Trang {currentPage} / {totalPages}
        </div>
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
          {pageNumbers.map((pageNumber) => (
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
          ))}
  
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