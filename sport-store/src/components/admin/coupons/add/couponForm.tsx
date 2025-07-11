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
import { useAuth } from "@/context/authContext";
import { TOKEN_CONFIG } from "@/config/token";

import { Percent, Coins, Calendar, Users, ShoppingCart, Loader2 } from "lucide-react";

const formSchema = z.object({
  type: z.enum(["%", "VNĐ"], {
    required_error: "Vui lòng chọn loại giảm giá",
  }),
  value: z.coerce.number().min(0, "Giá trị giảm giá không thể âm"),
  usageLimit: z.coerce.number().min(1, "Giới hạn sử dụng phải lớn hơn 0"),
  userLimit: z.coerce.number().min(1, "Giới hạn sử dụng trên mỗi user phải lớn hơn 0"),
  startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
  startTime: z.string().min(1, "Vui lòng chọn giờ bắt đầu"),
  endDate: z.string().min(1, "Vui lòng chọn ngày kết thúc"),
  endTime: z.string().min(1, "Vui lòng chọn giờ kết thúc"),
  minimumPurchaseAmount: z.coerce.number().min(0, "Số tiền tối thiểu không thể âm").default(0),
}).refine(
  (data) => {
    const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
    const endDateTime = new Date(`${data.endDate}T${data.endTime}`);
    return endDateTime > startDateTime;
  },
  {
    message: "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
    path: ["endDate"],
  }
);

type FormValues = z.infer<typeof formSchema>;

const CouponForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, checkAuthStatus } = useAuth();
  
  console.log('CouponForm rendering');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "%",
      value: 0,
      usageLimit: 1,
      userLimit: 1,
      minimumPurchaseAmount: 0,
      startDate: new Date().toISOString().split('T')[0],
      startTime: "00:00",
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endTime: "23:59",
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
      
      console.log('Form data:', data);
      
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
        type: data.type === "%" ? "percentage" : "fixed" as "percentage" | "fixed",
        value: Number(data.value),
        usageLimit: data.usageLimit,
        userLimit: data.userLimit,
        minimumPurchaseAmount: data.minimumPurchaseAmount,
        startDate: new Date(`${data.startDate}T${data.startTime}`).toISOString(),
        endDate: new Date(`${data.endDate}T${data.endTime}`).toISOString(),
      };

      const response = await fetch('/api/coupons/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formattedData),
      });
      
      const responseData = await response.json();
      
      console.log('Coupon creation response:', responseData);
      
      if (responseData.success && responseData.data) {
        toast.success("Tạo mã giảm giá thành công", {
          description: `Mã: ${responseData.data.code}, Giá trị: ${responseData.data.value}${responseData.data.type === 'percentage' ? '%' : ' VNĐ'}`
        });
        router.push("/admin/coupons/list");
      } else {
        console.error('Invalid response structure:', responseData);
        toast.error(responseData.message || "Không thể tạo mã giảm giá");
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error("Đã xảy ra lỗi khi tạo mã giảm giá");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Loại giảm giá và Giá trị */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium">Loại giảm giá</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                      <SelectValue placeholder="Chọn loại giảm giá" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="%" className="flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Phần trăm (%)
                    </SelectItem>
                    <SelectItem value="VNĐ" className="flex items-center gap-2">
                      <Coins className="w-4 h-4" />
                      Số tiền cố định (VNĐ)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-sm text-gray-500">
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
                <FormLabel className="text-base font-medium">Giá trị giảm giá</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="h-12 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pl-10"
                      placeholder="Nhập giá trị giảm giá"
                      {...field}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Percent className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-gray-500">
                  Nhập giá trị giảm giá
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Số tiền tối thiểu và Giới hạn sử dụng */}
          <FormField
            control={form.control}
            name="minimumPurchaseAmount"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium">Số tiền tối thiểu</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="h-12 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pl-10"
                      placeholder="Nhập số tiền tối thiểu để áp dụng mã"
                      {...field}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ShoppingCart className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-gray-500">
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
                <FormLabel className="text-base font-medium">Giới hạn sử dụng</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="h-12 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pl-10"
                      placeholder="Nhập số lần sử dụng tối đa"
                      {...field}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-gray-500">
                  Số lần tối đa mã giảm giá có thể được sử dụng
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Giới hạn user và Ngày bắt đầu */}
          <FormField
            control={form.control}
            name="userLimit"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium">Giới hạn sử dụng trên mỗi user</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="h-12 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pl-10"
                      placeholder="Nhập số lần sử dụng tối đa trên mỗi user"
                      {...field}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-gray-500">
                  Số lần tối đa mỗi user có thể sử dụng mã giảm giá
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
                <FormLabel className="text-base font-medium">Ngày bắt đầu</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="date"
                      className="h-12 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pl-10"
                      {...field}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-gray-500">
                  Ngày bắt đầu áp dụng mã giảm giá (có thể chọn ngày trong quá khứ)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Giờ bắt đầu và Ngày kết thúc */}
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium">Giờ bắt đầu</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="time"
                      className="h-12 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pl-10"
                      {...field}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-gray-500">
                  Giờ bắt đầu áp dụng mã giảm giá
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
                <FormLabel className="text-base font-medium">Ngày kết thúc</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="date"
                      className="h-12 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pl-10"

                      {...field}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-gray-500">
                  Ngày kết thúc áp dụng mã giảm giá (phải lớn hơn ngày bắt đầu)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Giờ kết thúc */}
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium">Giờ kết thúc</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="time"
                      className="h-12 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 pl-10"
                      {...field}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-gray-500">
                  Giờ kết thúc áp dụng mã giảm giá
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="h-12 px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg shadow-sm transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang tạo mã...
              </>
            ) : (
              "Tạo mã giảm giá"
            )}
          </Button>
        </div>
      </form>
    </Form>
    </div>
  );
};

export default CouponForm; 