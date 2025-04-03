import { Button } from "@/components/ui/button";

interface CategoryPaginationProps {
    currentPage: number;
    totalPages: number;
    total: number;
    startIndex: number;
    endIndex: number;
    onPageChange: (page: number) => void;
}

export default function CategoryPagination({ 
    currentPage, 
    totalPages, 
    total,
    startIndex,
    endIndex,
    onPageChange 
}: CategoryPaginationProps) {
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4">
            <div className="text-[clamp(0.75rem,1.5vw,1rem)] text-muted-foreground">
                Hiển thị {startIndex + 1} - {Math.min(endIndex, total)} / {total} danh mục
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-[clamp(0.75rem,1.5vw,1rem)]"
                >
                    Trước
                </Button>
                <div className="flex items-center gap-1 sm:gap-2">
                    {getPageNumbers().map((pageNumber, index) => (
                        pageNumber === '...' ? (
                            <span key={`dots-${index}`} className="px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 text-gray-500 text-[10px] sm:text-xs md:text-sm">
                                {pageNumber}
                            </span>
                        ) : (
                            <Button
                                key={pageNumber}
                                variant={currentPage === pageNumber ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(pageNumber as number)}
                                className="min-w-[clamp(2rem,4vw,2.5rem)] h-[clamp(1.5rem,3vw,2.5rem)] text-[clamp(0.75rem,1.5vw,1rem)]"
                            >
                                {pageNumber}
                            </Button>
                        )
                    ))}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-[clamp(0.75rem,1.5vw,1rem)]"
                >
                    Sau
                </Button>
            </div>
        </div>
    );
}