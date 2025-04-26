import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteButtonProps {
  selectedCount: number;
  onDelete: () => Promise<void>;
  disabled?: boolean;
}

export default function DeleteButton({ selectedCount, onDelete, disabled }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      className="group px-4 py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30"
      onClick={handleDelete}
      disabled={selectedCount === 0 || isDeleting || disabled}
    >
      {isDeleting ? (
        <>
          <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang xóa...
        </>
      ) : (
        <>
          <Trash2 size={16} className="mr-1.5 group-hover:animate-bounce" />
          Xóa đã chọn ({selectedCount})
        </>
      )}
    </button>
  );
} 