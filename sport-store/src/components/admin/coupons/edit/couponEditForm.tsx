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
  startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
  endDate: z.string().min(1, "Vui lòng chọn ngày kết thúc"),
  minimumPurchaseAmount: z.coerce.number().min(0, "Số tiền tối thiểu không thể âm").default(0),
}).refine(
  (data) => {
    const startDate = parseDateFromInput(data.startDate);
    const endDate = parseDateFromInput(data.endDate);
    return endDate > startDate;
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
        startDate: parseDateFromInput(data.startDate).toISOString(),
        endDate: parseDateFromInput(data.endDate).toISOString(),
      };

      console.log('Submitting form with data:', formattedData);
      const response = await couponService.updateCoupon(formattedData);
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
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Chỉnh sửa mã giảm giá</h2>
        <p className="text-gray-500">Mã giảm giá: {coupon.code}</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại giảm giá</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại giảm giá" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                      <SelectItem value="fixed">Số tiền cố định (VNĐ)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
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
                <FormItem>
                  <FormLabel>Giá trị giảm giá</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={
                        form.watch("type") === "percentage"
                          ? "Nhập phần trăm giảm giá (0-100)"
                          : "Nhập số tiền giảm giá"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
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
                <FormItem>
                  <FormLabel>Số tiền tối thiểu</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập số tiền tối thiểu để áp dụng mã"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
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
                <FormItem>
                  <FormLabel>Giới hạn sử dụng</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập số lần sử dụng tối đa"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
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
                <FormItem>
                  <FormLabel>Giới hạn sử dụng trên mỗi user</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập số lần sử dụng tối đa trên mỗi user"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
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
                <FormItem>
                  <FormLabel>Ngày bắt đầu</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      min={today}
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
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
                <FormItem>
                  <FormLabel>Ngày kết thúc</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      min={form.watch("startDate") || today}
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Thời điểm mã giảm giá hết hiệu lực
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CouponEditForm; 