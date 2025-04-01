import { Trash, Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface CouponDeleteButtonProps {
  selectedCount: number;
  onDelete: () => Promise<void>;
  disabled?: boolean;
}

export default function CouponActions({ selectedCount, onDelete, disabled }: CouponDeleteButtonProps) {
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
    <div className="flex gap-3">
      <Link href="/admin/coupons/add" passHref>
        <button
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <Plus size={18} />
          Thêm mã khuyến mại
        </button>
      </Link>

      <button
        className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
        onClick={handleDelete}
        disabled={selectedCount === 0 || isDeleting || disabled}
      >
        <Trash size={18} className={isDeleting ? "animate-spin" : ""} />
        {isDeleting ? "Đang xóa..." : `Xóa (${selectedCount})`}
      </button>
    </div>
  );
}