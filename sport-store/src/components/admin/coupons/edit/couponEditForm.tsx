"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { couponService } from "@/services/couponService";
import { Coupon } from "@/types/coupon";
import { useAuth } from "@/context/authContext";
import { TOKEN_CONFIG } from "@/config/token";
import { formatDateForInput, parseDateFromInput } from "@/utils/dateUtils";

const formSchema = z.object({
  type: z.enum(["percentage", "fixed"], {
    required_error: "Vui lòng chọn loại giảm giá",
  }),
  value: z.coerce.number().min(0, "Giá trị giảm giá không thể âm"),
  usageLimit: z.coerce.number().min(1, "Giới hạn sử dụng phải lớn hơn 0"),
  userLimit: z.coerce.number().min(1, "Giới hạn sử dụng trên mỗi user phải lớn hơn 0"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  minimumPurchaseAmount: z.coerce.number().min(0, "Số tiền tối thiểu không thể âm").default(0),
}).refine(
  (data) => {
    // Chỉ kiểm tra nếu cả hai ngày đều được nhập
    if (data.startDate && data.endDate) {
      const startDate = parseDateFromInput(data.startDate);
      const endDate = parseDateFromInput(data.endDate);
      return endDate > startDate;
    }
    return true;
  },
  {
    message: "Ngày kết thúc phải lớn hơn ngày bắt đầu",
    path: ["endDate"],
  }
).refine(
  (data) => {
    if (data.type === "percentage" && data.value > 100) {
      return false;
    }
    return true;
  },
  {
    message: "Phần trăm giảm giá không thể vượt quá 100%",
    path: ["value"],
  }
);

type FormValues = z.infer<typeof formSchema>;

interface CouponEditFormProps {
  coupon: Coupon;
  onSuccess: (updatedCoupon: Coupon) => void;
  onCancel: () => void;
}

const CouponEditForm: React.FC<CouponEditFormProps> = ({ coupon, onSuccess, onCancel }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, checkAuthStatus } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: coupon.type,
      value: coupon.value,
      usageLimit: coupon.usageLimit,
      userLimit: coupon.userLimit,
      minimumPurchaseAmount: coupon.minimumPurchaseAmount,
      startDate: formatDateForInput(coupon.startDate),
      endDate: formatDateForInput(coupon.endDate),
    },
  });

  // Kiểm tra xác thực khi component mount
  useEffect(() => {
    const setupAuth = async () => {
      // Kiểm tra token trong localStorage
      const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      
      if (accessToken) {
        // Kiểm tra trạng thái xác thực
        await checkAuthStatus();
      }
    };
    
    setupAuth();
  }, [checkAuthStatus]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Kiểm tra xác thực trước khi gửi request
      if (!isAuthenticated) {
        // Kiểm tra token trong localStorage
        const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
        
        if (accessToken) {
          // Kiểm tra trạng thái xác thực
          await checkAuthStatus();
          
          // Nếu vẫn không xác thực, chuyển hướng đến trang đăng nhập
          if (!isAuthenticated) {
            toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
            router.push("/auth/login");
            return;
          }
        } else {
          toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
          router.push("/auth/login");
          return;
        }
      }
      
      // Format dates to ISO string
      const formattedData = {
        _id: coupon._id,
        type: data.type,
        value: Number(data.value),
        usageLimit: data.usageLimit,
        userLimit: data.userLimit,
        minimumPurchaseAmount: data.minimumPurchaseAmount,
        // Đảm bảo startDate và endDate luôn là string
        startDate: data.startDate ? parseDateFromInput(data.startDate).toISOString() : coupon.startDate,
        endDate: data.endDate ? parseDateFromInput(data.endDate).toISOString() : coupon.endDate,
      };

      console.log('Submitting form with data:', formattedData);
      const response = await couponService.updateCoupon(formattedData._id, formattedData);
      console.log('Response from server:', response);
      
      if (response.success && response.data) {
        toast.success("Cập nhật mã giảm giá thành công");
        onSuccess(response.data);
        router.push("/admin/coupons/list");
      } else {
        console.error('Update failed:', response);
        toast.error(response.message || "Không thể cập nhật mã giảm giá");
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Đã xảy ra lỗi khi cập nhật mã giảm giá");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-emerald-50/40">
      {/* Glass Morphism Wrapper */}
      <div className="mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header with Enhanced 3D-like Effect */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-emerald-600/10 rounded-3xl transform -rotate-2"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-indigo-600/10 rounded-3xl transform rotate-2"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-indigo-100/60 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight relative">
                    Chỉnh sửa mã giảm giá
                    <span className="absolute -top-1 left-0 w-full h-full bg-white opacity-10 transform skew-x-12 translate-x-32"></span>
                  </h1>
                  <p className="text-indigo-100 mt-3 text-lg">
                    Mã giảm giá: <span className="font-mono font-bold">{coupon.code}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">Chế độ chỉnh sửa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Container with Glass Effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 rounded-3xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-indigo-500/5 rounded-3xl transform -rotate-1"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-indigo-100/60 p-6 sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-slate-700">Loại giảm giá</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border-slate-200/60 hover:border-indigo-300 focus:border-indigo-500 transition-all duration-300">
                        <SelectValue placeholder="Chọn loại giảm giá" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage" className="hover:bg-indigo-50">Phần trăm (%)</SelectItem>
                      <SelectItem value="fixed" className="hover:bg-emerald-50">Số tiền cố định (VNĐ)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-slate-500 text-sm">
                    Chọn loại giảm giá: phần trăm hoặc số tiền cố định
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-slate-700">Giá trị giảm giá</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-12 bg-white/80 backdrop-blur-sm border-slate-200/60 hover:border-indigo-300 focus:border-indigo-500 transition-all duration-300"
                      placeholder={
                        form.watch("type") === "percentage"
                          ? "Nhập phần trăm giảm giá (0-100)"
                          : "Nhập số tiền giảm giá"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-500 text-sm">
                    {form.watch("type") === "percentage"
                      ? "Nhập phần trăm giảm giá (0-100%)"
                      : "Nhập số tiền giảm giá (VNĐ)"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minimumPurchaseAmount"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-slate-700">Số tiền tối thiểu</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-12 bg-white/80 backdrop-blur-sm border-slate-200/60 hover:border-indigo-300 focus:border-indigo-500 transition-all duration-300"
                      placeholder="Nhập số tiền tối thiểu để áp dụng mã"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-500 text-sm">
                    Số tiền tối thiểu khách hàng cần mua để áp dụng mã giảm giá
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="usageLimit"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-slate-700">Giới hạn sử dụng</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-12 bg-white/80 backdrop-blur-sm border-slate-200/60 hover:border-indigo-300 focus:border-indigo-500 transition-all duration-300"
                      placeholder="Nhập số lần sử dụng tối đa"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-500 text-sm">
                    Số lần tối đa mã giảm giá có thể được sử dụng
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userLimit"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-slate-700">Giới hạn sử dụng trên mỗi user</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-12 bg-white/80 backdrop-blur-sm border-slate-200/60 hover:border-indigo-300 focus:border-indigo-500 transition-all duration-300"
                      placeholder="Nhập số lần sử dụng tối đa trên mỗi user"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-500 text-sm">
                    Số lần tối đa mỗi người dùng có thể sử dụng mã giảm giá
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-slate-700">Ngày bắt đầu</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="h-12 bg-white/80 backdrop-blur-sm border-slate-200/60 hover:border-indigo-300 focus:border-indigo-500 transition-all duration-300"
                      min={today}
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-500 text-sm">
                    Thời điểm mã giảm giá bắt đầu có hiệu lực
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-slate-700">Ngày kết thúc</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="h-12 bg-white/80 backdrop-blur-sm border-slate-200/60 hover:border-indigo-300 focus:border-indigo-500 transition-all duration-300"
                      min={form.watch("startDate") || today}
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription className="text-slate-500 text-sm">
                    Thời điểm mã giảm giá hết hiệu lực
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-200/60">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="px-8 py-3 text-slate-700 hover:bg-slate-100 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-400/20"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang xử lý...
                      </div>
                    ) : (
                      "Cập nhật mã giảm giá"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponEditForm; 