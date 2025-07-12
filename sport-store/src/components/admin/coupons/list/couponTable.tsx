"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Coupon } from "@/types/coupon";
import { formatDate } from "@/utils/dateUtils";
import { toast } from "sonner";
import { Power, Trash2, Eye, Percent, DollarSign } from "lucide-react";

import { AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CouponStatusBadge from "./couponStatusBadge";


interface CouponTableProps {
  coupons: Coupon[];
  selectedCoupons: string[];
  onSelectCoupon: (couponId: string) => void;
  onSelectAll: () => void;
  onDelete: (id: string) => Promise<void>;
  onPause: (id: string) => Promise<void>;
  onActivate: (id: string) => Promise<void>;
}

const CouponTable: React.FC<CouponTableProps> = ({
  coupons: initialCoupons,
  selectedCoupons,
  onSelectCoupon,
  onSelectAll,
  onDelete,
  onPause,
  onActivate,
}) => {
  const router = useRouter();
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);

  useEffect(() => {
    setCoupons(initialCoupons);
  }, [initialCoupons]);

  const handleDelete = (id: string) => {
    setCouponToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!couponToDelete) return;
    try {
      // Cập nhật UI ngay lập tức
      setCoupons(prevCoupons => 
        prevCoupons.filter(coupon => coupon._id !== couponToDelete)
      );
      
      await onDelete(couponToDelete);
      toast.success("Đã xóa mã giảm giá thành công");
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setCouponToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      return String((error as { message: unknown }).message);
    }
    return "Đã xảy ra lỗi không xác định";
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    const id = coupon._id;
    setIsUpdating(prev => ({ ...prev, [id]: true }));
    try {
      // Hỗ trợ cả status tiếng Việt và tiếng Anh
      const status = coupon.status as string;
      const isActive = status === "active" || status === "Hoạt động";
      const isInactive = status === "inactive" || status === "Tạm Dừng";
      
      if (isActive) {
        await onPause(id);
        toast.success("Tạm dừng mã giảm giá thành công");
      } else if (isInactive) {
        await onActivate(id);
        toast.success("Kích hoạt mã giảm giá thành công");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || "Không thể thay đổi trạng thái mã giảm giá");
    } finally {
      setIsUpdating(prev => ({ ...prev, [id]: false }));
    }
  };

  const getDiscountDisplay = (coupon: Coupon) =>
    coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value.toLocaleString('vi-VN')} VNĐ`;

  return (
    <div className="space-y-6">
      {/* Table Container with Enhanced Glass Effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-3xl transform rotate-1"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-3xl transform -rotate-1"></div>
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl border border-indigo-100/60 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200/60">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 backdrop-blur-sm">
                  <th className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedCoupons.length === coupons.length && coupons.length > 0}
                      onChange={onSelectAll}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition-all duration-200"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Mã</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Loại</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Giá trị</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Bắt đầu</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Kết thúc</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Thao tác</th>
                </tr>
              </thead>
                              <tbody className="divide-y divide-slate-200/60">
                  {coupons.length > 0 ? (
                    coupons.map((coupon, index) => (
                    <tr key={coupon._id} className={`group hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-emerald-50/50 transition-all duration-300 ${
                      index % 2 === 0 ? 'bg-white/60' : 'bg-slate-50/60'
                    }`}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCoupons.includes(coupon._id)}
                          onChange={() => onSelectCoupon(coupon._id)}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition-all duration-200"
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {coupon.code}
                      </td>
                      <td className="px-6 py-4">
                        {coupon.type === 'percentage' ? (
                          <div className="flex items-center gap-2">
                            <Percent className="h-4 w-4 text-indigo-500" />
                            <span className="text-slate-700">Phần trăm</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-emerald-500" />
                            <span className="text-slate-700">Số tiền</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {getDiscountDisplay(coupon)}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(coupon.startDate)}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(coupon.endDate)}
                      </td>
                      <td className="px-6 py-4">
                        <CouponStatusBadge status={coupon.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => router.push(`/admin/coupons/${coupon._id}`)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-200"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(coupon)}
                            disabled={isUpdating[coupon._id]}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${
                              ((coupon.status as string) === "active" || (coupon.status as string) === "Hoạt động")
                                ? "bg-amber-100 text-amber-600 hover:bg-amber-200" 
                                : "bg-green-100 text-green-600 hover:bg-green-200"
                            } transition-all duration-200 disabled:opacity-50`}
                          >
                            <Power size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon._id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 transition-all duration-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="mb-4 p-4 rounded-full bg-slate-100">
                          <AlertCircle size={32} className="text-slate-400" />
                        </div>
                        <p className="text-lg font-medium text-slate-800 mb-1">Không tìm thấy mã giảm giá</p>
                        <p className="text-slate-500">Hiện tại chưa có mã giảm giá nào trong hệ thống</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>



      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-sm border border-indigo-100/60 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-800 font-bold">Xác nhận xóa mã giảm giá</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Bạn có chắc chắn muốn xóa mã giảm giá này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CouponTable;

