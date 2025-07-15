"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

import { Coupon } from "@/types/coupon";
import { getTimeRemaining, formatDateForAPI } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import CouponEditForm from "@/components/admin/coupons/edit/couponEditForm";
import { Loader2, ArrowLeft, Edit, Trash2, Power, Users, Tag, Calendar, DollarSign, Percent, Clock } from "lucide-react";
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
        const response = await fetch(`/api/coupons/${id}`, {
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (data.success && data.data) {
          const responseData = data.data;
          if (responseData && typeof responseData === 'object' && 'coupon' in responseData) {
            setCoupon((responseData as { coupon: Coupon }).coupon);
          } else if (responseData) {
            setCoupon(responseData as Coupon);
          }
        } else {
          toast.error(data.message || "Không thể tải thông tin mã giảm giá");
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
      const response = await fetch(`/api/coupons/${coupon._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Xóa mã giảm giá thành công");
        router.push("/admin/coupons/list");
      } else {
        toast.error(data.message || "Không thể xóa mã giảm giá");
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
      const response = await fetch(`/api/coupons/${coupon._id}/pause`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        toast.success("Tạm dừng mã giảm giá thành công");
        const responseData = data.data;
        if (responseData && 'coupon' in responseData) {
          setCoupon(responseData.coupon);
        } else if (responseData) {
          setCoupon(responseData as Coupon);
        }
      } else {
        toast.error(data.message || "Không thể tạm dừng mã giảm giá");
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
      const response = await fetch(`/api/coupons/${coupon._id}/activate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        toast.success("Kích hoạt mã giảm giá thành công");
        const responseData = data.data;
        if (responseData && 'coupon' in responseData) {
          setCoupon(responseData.coupon);
        } else if (responseData) {
          setCoupon(responseData as Coupon);
        }
      } else {
        toast.error(data.message || "Không thể kích hoạt mã giảm giá");
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-2xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-2xl transform -rotate-1"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-8 shadow-xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-600 font-medium">Đang tải thông tin mã giảm giá...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-2xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-2xl transform -rotate-1"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-8 shadow-xl">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <Tag className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy mã giảm giá</h1>
                <p className="text-slate-500 mb-6">Mã giảm giá bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                <Button 
                  onClick={() => router.push("/admin/coupons/list")}
                  className="bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white transition-all duration-300"
                >
                  Quay lại danh sách
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Hoạt động</Badge>;
      case "inactive":
        return <Badge variant="destructive">Tạm dừng</Badge>;
      case "expired":
        return <Badge variant="secondary">Hết hạn</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40">
      {/* Glass Morphism Wrapper */}
      <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header with Enhanced 3D-like Effect */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-emerald-600/10 rounded-3xl transform -rotate-2"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-indigo-600/10 rounded-3xl transform rotate-2"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-indigo-100/60 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight relative">
                    Chi tiết mã giảm giá
                    <span className="absolute -top-1 left-0 w-full h-full bg-white opacity-10 transform skew-x-12 translate-x-32"></span>
                  </h1>
                  <p className="text-indigo-100 mt-3 text-lg">
                    Mã: <span className="font-mono font-bold">{coupon.code}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">Chế độ xem chi tiết</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-2xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-2xl transform -rotate-1"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-4 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/coupons/list")}
                className="flex items-center gap-2 hover:bg-slate-100 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-400/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại danh sách
              </Button>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-400/20"
                >
                  <Edit className="h-4 w-4" />
                  Chỉnh sửa
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-400/20"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Xóa
                </Button>
                {coupon.status === "active" && (
                  <Button
                    variant="outline"
                    onClick={handlePause}
                    disabled={isPausing}
                    className="flex items-center gap-2 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-400/20"
                  >
                    {isPausing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Power className="h-4 w-4" />
                    )}
                    Tạm dừng
                  </Button>
                )}
                {coupon.status === "inactive" && (
                  <Button
                    variant="outline"
                    onClick={handleActivate}
                    disabled={isActivating}
                    className="flex items-center gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400/20"
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
          </div>
        </div>

      {isEditing ? (
        <CouponEditForm
          coupon={coupon}
          onSuccess={handleEditSuccess}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-3xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-3xl transform -rotate-1"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-indigo-100/60 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-emerald-600/10 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                    {coupon.code}
                  </h2>
                  <p className="text-slate-600 mt-2 text-lg">
                    Mã giảm giá {coupon.type === "percentage" ? "theo phần trăm" : "theo số tiền cố định"}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(coupon.status)}
                </div>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-2xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-2xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-4 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-500 flex items-center justify-center">
                          <Tag className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <span className="font-semibold block text-sm text-slate-600">Loại giảm giá</span>
                          <span className="text-base font-medium text-slate-800">
                            {coupon.type === "percentage" ? "Phần trăm" : "Số tiền cố định"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-2xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-2xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-4 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-500 flex items-center justify-center">
                          {coupon.type === "percentage" ? (
                            <Percent className="h-5 w-5 text-white" />
                          ) : (
                            <DollarSign className="h-5 w-5 text-white" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold block text-sm text-slate-600">Giá trị</span>
                          <span className="text-base font-bold text-slate-800">
                            {coupon.type === "percentage"
                              ? `${coupon.value}%`
                              : `${coupon.value.toLocaleString()} VNĐ`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-2xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-2xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-4 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <span className="font-semibold block text-sm text-slate-600">Thời gian</span>
                          <span className="text-base font-medium text-slate-800">
                            {formatDateForAPI(coupon.startDate)} - {formatDateForAPI(coupon.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-2xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-2xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-4 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <span className="font-semibold block text-sm text-slate-600">Giới hạn sử dụng</span>
                          <span className="text-base font-medium text-slate-800">
                            {coupon.usageLimit
                              ? `${coupon.usageCount}/${coupon.usageLimit}`
                              : "Không giới hạn"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-2" />

                <div>
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-3 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-emerald-500 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                    Điều kiện áp dụng
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-2xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-2xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
                      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-4 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <span className="font-semibold block text-sm text-slate-600">Giá trị đơn hàng tối thiểu</span>
                            <span className="text-base font-medium text-slate-800">
                              {coupon.minimumPurchaseAmount
                                ? `${coupon.minimumPurchaseAmount.toLocaleString()}đ`
                                : "Không có"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-2xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-2xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
                      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-indigo-100/60 p-4 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <span className="font-semibold block text-sm text-slate-600">Giới hạn sử dụng mỗi người</span>
                            <span className="text-base font-medium text-slate-800">
                              {coupon.userLimit
                                ? `${coupon.userLimit} lần`
                                : "Không giới hạn"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {new Date(coupon.startDate) > new Date() && (
                  <div className="relative mt-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl transform rotate-1"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-2xl transform -rotate-1"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-200/60 p-6 shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-blue-800 mb-1">Sắp bắt đầu</h4>
                          <p className="text-blue-700">Còn {getTimeRemaining(coupon.startDate)} nữa sẽ bắt đầu</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {coupon.status === "expired" && (
                  <div className="relative mt-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-500/10 to-gray-500/10 rounded-2xl transform rotate-1"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-slate-500/10 rounded-2xl transform -rotate-1"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 shadow-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-slate-500 to-gray-500 flex items-center justify-center">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-slate-800 mb-1">Đã hết hạn</h4>
                          <p className="text-slate-700">Mã giảm giá đã hết hạn vào {formatDateForAPI(coupon.endDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CouponDetailClient; 