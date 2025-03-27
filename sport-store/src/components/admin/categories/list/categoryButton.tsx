import { Trash, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface CategoryDeleteButtonProps {
  selectedCount: number;
  onDelete: () => Promise<void>;
  disabled?: boolean;
}

export default function CategoryActions({ selectedCount, onDelete, disabled }: CategoryDeleteButtonProps) {
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
    <div className="flex gap-4">
      <Link href="/admin/categories/add" passHref>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Thêm thể loại
        </button>
      </Link>
      
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        onClick={handleDelete}
        disabled={selectedCount === 0 || isDeleting || disabled}
      >
        <Trash size={16} className={isDeleting ? "animate-spin" : ""} />
        {isDeleting ? "Đang xóa..." : `Xóa (${selectedCount})`}
      </button>
    </div>
  );
}
