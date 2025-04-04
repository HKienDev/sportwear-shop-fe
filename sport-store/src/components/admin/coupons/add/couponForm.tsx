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
import { useAuth } from "@/context/authContext";
import { TOKEN_CONFIG } from "@/config/token";
import { apiClient } from "@/lib/api";
import { formatDateForInput, parseDateFromInput } from "@/utils/dateUtils";

const formSchema = z.object({
  type: z.enum(["%", "VNĐ"], {
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
    if (data.type === "%" && data.value > 100) {
      return false;
    }
    return true;
  },
  {
    message: "Phần trăm giảm giá không thể vượt quá 100%",
    path: ["value"],
  }
).refine(
  (data) => {
    const startDate = parseDateFromInput(data.startDate);
    const now = new Date();
    return startDate >= now;
  },
  {
    message: "Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại",
    path: ["startDate"],
  }
);

type FormValues = z.infer<typeof formSchema>;

const CouponForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, checkAuthStatus } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "%",
      value: 0,
      usageLimit: 1,
      userLimit: 1,
      minimumPurchaseAmount: 0,
      startDate: formatDateForInput(new Date().toISOString()),
      endDate: formatDateForInput(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()),
    },
  });

  // Kiểm tra xác thực khi component mount
  useEffect(() => {
    const setupAuth = async () => {
      // Kiểm tra token trong localStorage
      const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      
      if (accessToken) {
        // Thiết lập token cho apiClient
        apiClient.setAuthToken(accessToken);
        
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
          // Thiết lập token cho apiClient
          apiClient.setAuthToken(accessToken);
          
          // Kiểm tra trạng thái xác thực
          await checkAuthStatus();
          
          // Nếu vẫn không xác thực, chuyển hướng đến trang đăng nhập
          if (!isAuthenticated) {
            toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
            router.push("/auth/login");
            return;
          }
        } else {
          toast.error("Vui lòng đăng nhập để thực hiện thao tác này");
          router.push("/auth/login");
          return;
        }
      }
      
      // Format dates to ISO string
      const formattedData = {
        type: data.type === "%" ? "percentage" : "fixed",
        value: Number(data.value),
        usageLimit: data.usageLimit,
        userLimit: data.userLimit,
        minimumPurchaseAmount: data.minimumPurchaseAmount,
        startDate: new Date(parseDateFromInput(data.startDate)).toISOString(),
        endDate: new Date(parseDateFromInput(data.endDate)).toISOString(),
      };

      const response = await couponService.createCoupon(formattedData);
      
      if (response.success && response.data) {
        toast.success("Tạo mã giảm giá thành công", {
          description: `Mã: ${response.data.code}, Giá trị: ${response.data.value}${response.data.type === '%' ? '%' : ' VNĐ'}`
        });
        router.push("/admin/coupons/list");
      } else {
        toast.error(response.message || "Không thể tạo mã giảm giá");
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error("Đã xảy ra lỗi khi tạo mã giảm giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
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
                    <SelectItem value="%">Phần trăm (%)</SelectItem>
                    <SelectItem value="VNĐ">Số tiền cố định (VNĐ)</SelectItem>
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
                      form.watch("type") === "%"
                        ? "Nhập phần trăm giảm giá (0-100)"
                        : "Nhập số tiền giảm giá"
                    }
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {form.watch("type") === "%"
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
            onClick={() => router.push("/admin/coupons/list")}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : "Tạo mã giảm giá"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CouponForm; 