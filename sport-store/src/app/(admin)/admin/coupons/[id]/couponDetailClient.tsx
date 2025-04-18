"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { couponService } from "@/services/couponService";
import { Coupon } from "@/types/coupon";
import { getTimeRemaining, formatDateForAPI } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import CouponEditForm from "@/components/admin/coupons/edit/couponEditForm";
import { Loader2, ArrowLeft, Edit, Trash2, Power, Users, Tag, Calendar, DollarSign, Percent, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface CouponDetailClientProps {
  id: string;
}

const CouponDetailClient: React.FC<CouponDetailClientProps> = ({ id }) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        setLoading(true);
        const response = await couponService.getCouponById(id);
        
        if (response.success && response.data) {
          if ('coupon' in response.data) {
            setCoupon(response.data.coupon);
          } else {
            setCoupon(response.data as Coupon);
          }
        } else {
          toast.error(response.message || "Không thể tải thông tin mã giảm giá");
          router.push("/admin/coupons/list");
        }
      } catch (error) {
        console.error("Error fetching coupon:", error);
        
        let errorMessage = "Đã xảy ra lỗi khi tải thông tin mã giảm giá";
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
          errorMessage = String((error as { message: unknown }).message);
        }
        
        toast.error(errorMessage);
        router.push("/admin/coupons/list");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === "admin") {
      fetchCoupon();
    }
  }, [id, isAuthenticated, user, router]);

  const handleDelete = async () => {
    if (!coupon) return;

    if (!window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await couponService.deleteCoupon(coupon._id);
      
      if (response.success) {
        toast.success("Xóa mã giảm giá thành công");
        router.push("/admin/coupons/list");
      } else {
        toast.error(response.message || "Không thể xóa mã giảm giá");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Đã xảy ra lỗi khi xóa mã giảm giá");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePause = async () => {
    if (!coupon) return;

    try {
      setIsPausing(true);
      const response = await couponService.pauseCoupon(coupon._id);
      
      if (response.success && response.data) {
        toast.success("Tạm dừng mã giảm giá thành công");
        if ('coupon' in response.data) {
          setCoupon(response.data.coupon);
        } else {
          setCoupon(response.data as Coupon);
        }
      } else {
        toast.error(response.message || "Không thể tạm dừng mã giảm giá");
      }
    } catch (error) {
      console.error("Error pausing coupon:", error);
      toast.error("Đã xảy ra lỗi khi tạm dừng mã giảm giá");
    } finally {
      setIsPausing(false);
    }
  };

  const handleActivate = async () => {
    if (!coupon) return;

    try {
      setIsActivating(true);
      const response = await couponService.activateCoupon(coupon._id);
      
      if (response.success && response.data) {
        toast.success("Kích hoạt mã giảm giá thành công");
        if ('coupon' in response.data) {
          setCoupon(response.data.coupon);
        } else {
          setCoupon(response.data as Coupon);
        }
      } else {
        toast.error(response.message || "Không thể kích hoạt mã giảm giá");
      }
    } catch (error) {
      console.error("Error activating coupon:", error);
      toast.error("Đã xảy ra lỗi khi kích hoạt mã giảm giá");
    } finally {
      setIsActivating(false);
    }
  };

  const handleEditSuccess = (updatedCoupon: Coupon) => {
    setCoupon(updatedCoupon);
    setIsEditing(false);
    toast.success("Cập nhật mã giảm giá thành công");
    
    router.push("/admin/coupons/list");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy mã giảm giá</h1>
        <Button onClick={() => router.push("/admin/coupons/list")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/coupons/list")}
          className="flex items-center gap-2 hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 hover:bg-muted/50 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 transition-colors"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Xóa
          </Button>
          {coupon.status === "Hoạt động" && (
            <Button
              variant="outline"
              onClick={handlePause}
              disabled={isPausing}
              className="flex items-center gap-2 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-colors"
            >
              {isPausing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Power className="h-4 w-4" />
              )}
              Tạm dừng
            </Button>
          )}
          {coupon.status === "Tạm Dừng" && (
            <Button
              variant="outline"
              onClick={handleActivate}
              disabled={isActivating}
              className="flex items-center gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors"
            >
              {isActivating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Power className="h-4 w-4" />
              )}
              Kích hoạt
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <CouponEditForm
          coupon={coupon}
          onSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="grid gap-6">
          <Card className="overflow-hidden border-0 shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold tracking-tight">{coupon.code}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Mã giảm giá {coupon.type === "percentage" ? "theo phần trăm" : "theo số tiền cố định"}
                  </CardDescription>
                </div>
                <div className="text-right">
                  {getStatusBadge(coupon.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Tag className="h-5 w-5 text-primary" />
                    <div>
                      <span className="font-medium block text-sm text-muted-foreground">Loại giảm giá</span>
                      <span className="text-base">
                        {coupon.type === "percentage" ? "Phần trăm" : "Số tiền cố định"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    {coupon.type === "percentage" ? (
                      <Percent className="h-5 w-5 text-primary" />
                    ) : (
                      <DollarSign className="h-5 w-5 text-primary" />
                    )}
                    <div>
                      <span className="font-medium block text-sm text-muted-foreground">Giá trị</span>
                      <span className="text-base font-medium">
                        {coupon.type === "percentage"
                          ? `${coupon.value}%`
                          : `${coupon.value.toLocaleString()} VNĐ`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <span className="font-medium block text-sm text-muted-foreground">Thời gian</span>
                      <span className="text-base">
                        {formatDateForAPI(coupon.startDate)} - {formatDateForAPI(coupon.endDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <span className="font-medium block text-sm text-muted-foreground">Giới hạn sử dụng</span>
                      <span className="text-base">
                        {coupon.usageLimit
                          ? `${coupon.usageCount}/${coupon.usageLimit}`
                          : "Không giới hạn"}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-2" />

                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Điều kiện áp dụng
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <div>
                        <span className="font-medium block text-sm text-muted-foreground">Giá trị đơn hàng tối thiểu</span>
                        <span className="text-base">
                          {coupon.minimumPurchaseAmount
                            ? `${coupon.minimumPurchaseAmount.toLocaleString()}đ`
                            : "Không có"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <span className="font-medium block text-sm text-muted-foreground">Giới hạn sử dụng mỗi người</span>
                        <span className="text-base">
                          {coupon.userLimit
                            ? `${coupon.userLimit} lần`
                            : "Không giới hạn"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {coupon.status === "Sắp diễn ra" && (
                  <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Clock className="h-5 w-5" />
                      <span className="font-medium">Còn {getTimeRemaining(coupon.startDate)} nữa sẽ bắt đầu</span>
                    </div>
                  </div>
                )}

                {coupon.status === "Hết hạn" && (
                  <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-5 w-5" />
                      <span className="font-medium">Mã giảm giá đã hết hạn vào {formatDateForAPI(coupon.endDate)}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CouponDetailClient; 