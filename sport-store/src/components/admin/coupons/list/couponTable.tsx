"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Coupon } from "@/types/coupon";
import { formatDate, getTimeRemaining } from "@/utils/dateUtils";
import { toast } from "sonner";
import { Power, Trash2, Eye, Percent, DollarSign, Calendar, Clock } from "lucide-react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

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
  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 10;

  useEffect(() => {
    setCoupons(initialCoupons);
  }, [initialCoupons]);

  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = coupons.slice(indexOfFirstCoupon, indexOfLastCoupon);
  const totalPages = Math.ceil(coupons.length / couponsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      setCoupons(coupons.filter(coupon => coupon._id !== id));
      toast.success("Xóa mã giảm giá thành công");
    } catch {
      toast.error("Không thể xóa mã giảm giá");
    }
  };

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as ApiError;
      // Kiểm tra response từ server
      if (axiosError.response?.data?.message) {
        return axiosError.response.data.message;
      } else if (axiosError.response?.data?.error) {
        return axiosError.response.data.error;
      } else if (axiosError.message) {
        return axiosError.message;
      }
    } else if (error instanceof Error) {
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
      if (isStatus(coupon.status, "Hoạt động")) {
        await onPause(id);
        toast.success("Tạm dừng mã giảm giá thành công");
      } else if (isStatus(coupon.status, "Tạm Dừng")) {
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

  const isStatus = (status: string, targetStatus: string) =>
    status.toLowerCase() === targetStatus.toLowerCase();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Hoạt động":
        return <Badge variant="success">Hoạt động</Badge>;
      case "Tạm Dừng":
        return <Badge variant="destructive">Tạm dừng</Badge>;
      case "Hết hạn":
        return <Badge variant="secondary">Hết hạn</Badge>;
      case "Sắp diễn ra":
        return <Badge variant="outline">Sắp diễn ra</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getDiscountDisplay = (coupon: Coupon) =>
    coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value.toLocaleString('vi-VN')} VNĐ`;

  const getTimeDisplay = (coupon: Coupon) => {
    if (isStatus(coupon.status, "Sắp diễn ra")) {
      return (
        <div className="flex items-center gap-1 text-blue-600">
          <Clock className="h-4 w-4" />
          <span>Còn {getTimeRemaining(coupon.startDate)}</span>
        </div>
      );
    } else if (isStatus(coupon.status, "Hết hạn")) {
      return (
        <div className="flex items-center gap-1 text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Hết hạn {formatDate(coupon.endDate)}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formatDate(coupon.startDate)}</span>
        </div>
      );
    }
  };

  return (
    <div className="px-4 py-6 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-teal-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Tổng Mã Giảm Giá</p>
                <p className="text-2xl font-bold text-slate-800">{coupons.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center">
                <span className="text-teal-500 text-xl font-bold">Σ</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Đang Hoạt Động</p>
                <p className="text-2xl font-bold text-slate-800">
                  {coupons.filter(coupon => isStatus(coupon.status, "Hoạt động")).length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
                <span className="text-indigo-500 text-xl font-bold">⧗</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Tạm Dừng</p>
                <p className="text-2xl font-bold text-slate-800">
                  {coupons.filter(coupon => isStatus(coupon.status, "Tạm Dừng")).length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                <span className="text-amber-500 text-xl font-bold">⏸️</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-emerald-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Hết Hạn</p>
                <p className="text-2xl font-bold text-slate-800">
                  {coupons.filter(coupon => isStatus(coupon.status, "Hết hạn")).length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <span className="text-emerald-500 text-xl font-bold">✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coupons Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <th className="px-6 py-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedCoupons.length === coupons.length && coupons.length > 0}
                      onChange={onSelectAll}
                      className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Mã</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Loại</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Giá trị</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Bắt đầu</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Kết thúc</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentCoupons.length > 0 ? (
                  currentCoupons.map((coupon, index) => (
                    <tr key={coupon._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-teal-50 transition-colors duration-150`}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCoupons.includes(coupon._id)}
                          onChange={() => onSelectCoupon(coupon._id)}
                          className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium">{coupon.code}</td>
                      <td className="px-6 py-4">
                        {coupon.type === 'percentage' ? (
                          <div className="flex items-center gap-1">
                            <Percent className="h-4 w-4 text-primary" />
                            <span>Phần trăm</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <span>Số tiền</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">{getDiscountDisplay(coupon)}</td>
                      <td className="px-6 py-4">{getTimeDisplay(coupon)}</td>
                      <td className="px-6 py-4">{formatDate(coupon.endDate)}</td>
                      <td className="px-6 py-4">{getStatusBadge(coupon.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/coupons/${coupon._id}`)}
                            className="h-8 w-8 hover:bg-muted"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Xem chi tiết</span>
                          </Button>
                          {(isStatus(coupon.status, "Hoạt động") || isStatus(coupon.status, "Tạm Dừng")) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleStatus(coupon)}
                              disabled={isUpdating[coupon._id]}
                              className={`h-8 w-8 ${
                                isStatus(coupon.status, "Hoạt động")
                                  ? "hover:bg-amber-50 hover:text-amber-700"
                                  : "hover:bg-green-50 hover:text-green-700"
                              }`}
                            >
                              {isUpdating[coupon._id] ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : (
                                <Power className="h-4 w-4" />
                              )}
                              <span className="sr-only">
                                {isStatus(coupon.status, "Hoạt động") ? "Tạm dừng" : "Kích hoạt"}
                              </span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(coupon._id)}
                            className="h-8 w-8 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Xóa</span>
                          </Button>
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

        {/* Pagination */}
        {coupons.length > 0 && (
          <div className="flex flex-wrap justify-between items-center">
            <div className="text-sm text-slate-600 mb-2 sm:mb-0">
              Trang <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg flex items-center justify-center ${
                  currentPage === 1
                    ? "text-slate-300 cursor-not-allowed bg-slate-50"
                    : "text-slate-700 hover:bg-teal-50 bg-white border border-slate-200"
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageToShow;
                if (totalPages <= 5) {
                  pageToShow = i + 1;
                } else if (currentPage <= 3) {
                  pageToShow = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageToShow = totalPages - 4 + i;
                } else {
                  pageToShow = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageToShow}
                    onClick={() => paginate(pageToShow)}
                    className={`w-10 h-10 rounded-lg text-center ${
                      currentPage === pageToShow
                        ? "bg-teal-500 text-white font-medium"
                        : "text-slate-600 hover:bg-teal-50 bg-white border border-slate-200"
                    }`}
                  >
                    {pageToShow}
                  </button>
                );
              })}
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg flex items-center justify-center ${
                  currentPage === totalPages
                    ? "text-slate-300 cursor-not-allowed bg-slate-50"
                    : "text-slate-700 hover:bg-teal-50 bg-white border border-slate-200"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};export default CouponTable;

