"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Coupon } from "@/types/coupon";
import { formatDate, getTimeRemaining } from "@/utils/dateUtils";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Power, Trash2, Edit, Eye, Percent, DollarSign, Calendar, Clock } from "lucide-react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// Định nghĩa kiểu dữ liệu cho lỗi
interface ApiError {
  message?: string;
  status?: number;
  data?: unknown;
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
}

interface CouponTableProps {
  coupons: Coupon[];
  loading: boolean;
  selectedCoupons: string[];
  onSelectCoupon: (couponId: string) => void;
  onSelectAll: () => void;
  onDelete: (id: string) => Promise<void>;
  onPause: (id: string) => Promise<void>;
  onActivate: (id: string) => Promise<void>;
}

const CouponTable: React.FC<CouponTableProps> = ({
  coupons: initialCoupons,
  loading,
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

  // Cập nhật state khi props thay đổi
  useEffect(() => {
    setCoupons(initialCoupons);
  }, [initialCoupons]);

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      // Cập nhật state sau khi xóa thành công
      setCoupons(coupons.filter(coupon => coupon._id !== id));
      toast.success("Xóa mã giảm giá thành công");
    } catch {
      toast.error("Không thể xóa mã giảm giá");
    }
  };

  // Hàm kiểm tra trạng thái không phân biệt chữ hoa/chữ thường
  const isStatus = (status: string, targetStatus: string) => {
    return status.toLowerCase() === targetStatus.toLowerCase();
  };

  // Hàm lấy thông báo lỗi từ AxiosError
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

  const getDiscountDisplay = (coupon: Coupon) => {
    if (coupon.type === "%") {
      return (
        <div className="flex items-center gap-1">
          <Percent className="h-4 w-4 text-primary" />
          <span>{coupon.value}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4 text-primary" />
          <span>{coupon.value.toLocaleString()} VNĐ</span>
        </div>
      );
    }
  };

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

  const getEndTimeDisplay = (coupon: Coupon) => {
    if (isStatus(coupon.status, "Hết hạn")) {
      return (
        <div className="flex items-center gap-1 text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(coupon.endDate)}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formatDate(coupon.endDate)}</span>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-32" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-32" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-4 w-16 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-24 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedCoupons.length === coupons.length && coupons.length > 0}
                onCheckedChange={onSelectAll}
                aria-label="Chọn tất cả"
              />
            </TableHead>
            <TableHead>Mã</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Giá trị</TableHead>
            <TableHead>Bắt đầu</TableHead>
            <TableHead>Kết thúc</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Không tìm thấy mã giảm giá nào
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon) => (
              <TableRow key={coupon._id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <Checkbox
                    checked={selectedCoupons.includes(coupon._id)}
                    onCheckedChange={() => onSelectCoupon(coupon._id)}
                    aria-label={`Chọn ${coupon.code}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{coupon.code}</TableCell>
                <TableCell>
                  {coupon.type === "%" ? (
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
                </TableCell>
                <TableCell>{getDiscountDisplay(coupon)}</TableCell>
                <TableCell>{getTimeDisplay(coupon)}</TableCell>
                <TableCell>{getEndTimeDisplay(coupon)}</TableCell>
                <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                <TableCell className="text-right">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/admin/coupons/${coupon._id}`)}
                      className="h-8 w-8 hover:bg-muted"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Chỉnh sửa</span>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CouponTable;