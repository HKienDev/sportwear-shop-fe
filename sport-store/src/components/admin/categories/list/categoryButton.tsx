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
          className="group relative px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Plus size={18} className="relative z-10" />
          <span className="relative z-10">Thêm thể loại</span>
        </button>
      </Link>
      
      <button
        className={`group relative px-6 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 flex items-center gap-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none`}
        onClick={handleDelete}
        disabled={selectedCount === 0 || isDeleting || disabled}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Trash size={18} className={`relative z-10 ${isDeleting ? "animate-spin" : ""}`} />
        <span className="relative z-10">
          {isDeleting ? "Đang xóa..." : `Xóa (${selectedCount})`}
        </span>
      </button>
    </div>
  );
}
