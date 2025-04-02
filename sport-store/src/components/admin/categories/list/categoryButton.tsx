import { Trash, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
      <Link href="/admin/categories/add" passHref>
        <Button
          className="w-full sm:w-auto text-[clamp(0.75rem,1.5vw,1rem)]"
        >
          <div className="flex items-center gap-[clamp(0.25rem,0.5vw,0.5rem)]">
            <Plus className="w-[clamp(0.75rem,1.5vw,1rem)] h-[clamp(0.75rem,1.5vw,1rem)]" />
            <span className="text-[clamp(0.75rem,1.5vw,1rem)]">Thêm mới</span>
          </div>
        </Button>
      </Link>
      
      <Button
        onClick={handleDelete}
        className={`w-full sm:w-auto text-[clamp(0.75rem,1.5vw,1rem)] bg-gradient-to-r from-red-500 to-red-600 text-white font-medium shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none`}
        disabled={selectedCount === 0 || isDeleting || disabled}
      >
        <Trash size={14} className={`relative z-10 sm:w-4 sm:h-4 md:w-5 md:h-5 ${isDeleting ? "animate-spin" : ""}`} />
        <span className="relative z-10">
          {isDeleting ? "Đang xóa..." : `Xóa (${selectedCount})`}
        </span>
      </Button>
    </div>
  );
}
