import { Trash } from "lucide-react";
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
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      onClick={handleDelete}
      disabled={selectedCount === 0 || isDeleting || disabled}
    >
      <Trash size={16} className={isDeleting ? "animate-spin" : ""} />
      {isDeleting ? "Đang xóa..." : `Xóa (${selectedCount})`}
    </button>
  );
} 