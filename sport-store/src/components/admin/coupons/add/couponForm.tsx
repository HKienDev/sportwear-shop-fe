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
  
  // Time input states
  const [startTimeValue, setStartTimeValue] = useState("");
  const [endTimeValue, setEndTimeValue] = useState("");
  
  // Format time function
  const formatTime = (time: string) => {
    if (time.length === 0) return "";
    if (time.length === 1) return time;
    if (time.length === 2) return time;
    return time.slice(0, 2) + ":" + time.slice(2);
  };
  
  // Handle time change with smart validation
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, setValue: (val: string) => void, field: { onChange: (value: string) => void }) => {
    let newValue = e.target.value.replace(/[^\d]/g, "");
    
    // Auto-validate và format thông minh
    if (newValue.length >= 1) {
      const hour = newValue.slice(0, 2);
      const minute = newValue.slice(2, 4);
      
      // Giới hạn giờ 0-23
      if (parseInt(hour) > 23) {
        newValue = "23" + minute;
      }
      
      // Giới hạn phút 0-59
      if (newValue.length >= 3 && parseInt(minute) > 59) {
        newValue = hour + "59";
      }
    }
    
    if (newValue.length <= 4) {
      setValue(newValue);
      
      // Update form field when complete
      if (newValue.length === 4) {
        const hour = newValue.slice(0, 2);
        const minute = newValue.slice(2);
        const hourNum = parseInt(hour);
        const minuteNum = parseInt(minute);
        
        if (hourNum >= 0 && hourNum <= 23 && minuteNum >= 0 && minuteNum <= 59) {
          field.onChange(`${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`);
        }
      }
    }
  };
  
  // Handle backspace for time input
  const handleTimeKeyDown = (e: React.KeyboardEvent, value: string, setValue: (val: string) => void) => {
    // Backspace xóa cả dấu ":"
    if (e.key === 'Backspace' && value.length === 3) {
      setValue(value.slice(0, 2));
      e.preventDefault();
    }
  };
  

  
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

  // Sync time values with form on mount
  useEffect(() => {
    form.setValue('startTime', '00:00');
    form.setValue('endTime', '23:59');
  }, [form]);

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
      
      // Validate required fields
      if (!data.value || Number(data.value) <= 0) {
        toast.error("Giá trị giảm giá phải lớn hơn 0");
        return;
      }

      // Validate percentage value
      if (data.type === "%" && Number(data.value) > 100) {
        toast.error("Giá trị giảm giá theo phần trăm không được vượt quá 100%");
        form.setError('value', {
          type: 'manual',
          message: 'Giá trị giảm giá theo phần trăm không được vượt quá 100%'
        });
        return;
      }

      // Validate fixed amount value
      if (data.type === "VNĐ" && Number(data.value) > 10000000) {
        toast.error("Giá trị giảm giá cố định không được vượt quá 10.000.000 VNĐ");
        form.setError('value', {
          type: 'manual',
          message: 'Giá trị giảm giá cố định không được vượt quá 10.000.000 VNĐ'
        });
        return;
      }

      // Format dates to ISO string
      const formattedData = {
        type: data.type === "%" ? "percentage" : "fixed" as "percentage" | "fixed",
        value: Number(data.value),
        usageLimit: data.usageLimit,
        userLimit: data.userLimit,
        minimumPurchaseAmount: data.minimumPurchaseAmount,
        startDate: new Date(`${data.startDate}T${data.startTime || '00:00'}`).toISOString(),
        endDate: new Date(`${data.endDate}T${data.endTime || '23:59'}`).toISOString(),
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
        // Handle validation errors from backend
        if (responseData.errors && Array.isArray(responseData.errors)) {
          responseData.errors.forEach((error: { field: string; message: string }) => {
            if (error.field && error.message) {
              try {
                form.setError(error.field as keyof FormValues, {
                  type: 'server',
                  message: error.message
                });
              } catch (error) {
                console.warn('Error setting form error:', error);
              }
            }
          });
          toast.error("Vui lòng kiểm tra lại thông tin nhập");
        } else {
          console.warn('Backend validation failed:', responseData);
          toast.error(responseData.message || "Không thể tạo mã giảm giá");
        }
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error("Đã xảy ra lỗi khi tạo mã giảm giá");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Loại giảm giá và Giá trị */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-indigo-500 to-emerald-500 flex items-center justify-center">
                    <Percent className="w-3 h-3 text-white" />
                  </div>
                  Loại giảm giá
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-14 bg-white/80 backdrop-blur-sm border border-indigo-100/60 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-300 rounded-xl transition-all duration-300 hover:shadow-lg">
                      <SelectValue placeholder="Chọn loại giảm giá">
                        {field.value === "%" && (
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                              <Percent className="w-3 h-3 text-white" />
                            </div>
                            <span className="font-medium">Phần trăm (%)</span>
                          </div>
                        )}
                        {field.value === "VNĐ" && (
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                              <Coins className="w-3 h-3 text-white" />
                            </div>
                            <span className="font-medium">Số tiền cố định (VNĐ)</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white/95 backdrop-blur-sm border border-indigo-100/60 rounded-xl shadow-xl">
                    <SelectItem value="%" className="flex items-center gap-3 hover:bg-indigo-50 rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Percent className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">Phần trăm (%)</span>
                    </SelectItem>
                    <SelectItem value="VNĐ" className="flex items-center gap-3 hover:bg-emerald-50 rounded-lg">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                        <Coins className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">Số tiền cố định (VNĐ)</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-sm text-slate-600">
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
              <FormItem className="space-y-4">
                <FormLabel className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Coins className="w-3 h-3 text-white" />
                  </div>
                  Giá trị giảm giá
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
                    <div className="relative">
                      <Input
                        type="text"
                        className="h-14 bg-white/80 backdrop-blur-sm border border-indigo-100/60 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-300 rounded-xl pl-12 transition-all duration-300 hover:shadow-lg"
                        placeholder="VD: 10"
                        value={field.value ? String(field.value).replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\./g, "");
                          if (newValue === "" || /^\d+$/.test(newValue)) {
                            field.onChange(newValue);
                          }
                        }}
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-indigo-500 to-emerald-500 flex items-center justify-center">
                          <Percent className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-slate-600">
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
              <FormItem className="space-y-4">
                <FormLabel className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <ShoppingCart className="w-3 h-3 text-white" />
                  </div>
                  Số tiền tối thiểu
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
                    <div className="relative">
                      <Input
                        type="text"
                        className="h-14 bg-white/80 backdrop-blur-sm border border-indigo-100/60 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-300 rounded-xl pl-12 transition-all duration-300 hover:shadow-lg"
                        placeholder="VD: 100.000"
                        value={field.value ? String(field.value).replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\./g, "");
                          if (newValue === "" || /^\d+$/.test(newValue)) {
                            field.onChange(newValue);
                          }
                        }}
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                          <ShoppingCart className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-slate-600">
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
              <FormItem className="space-y-4">
                <FormLabel className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                    <Users className="w-3 h-3 text-white" />
                  </div>
                  Giới hạn sử dụng
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
                    <div className="relative">
                      <Input
                        type="text"
                        className="h-14 bg-white/80 backdrop-blur-sm border border-indigo-100/60 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-300 rounded-xl pl-12 transition-all duration-300 hover:shadow-lg"
                        placeholder="VD: 100"
                        value={field.value ? String(field.value).replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\./g, "");
                          if (newValue === "" || /^\d+$/.test(newValue)) {
                            field.onChange(newValue);
                          }
                        }}
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                          <Users className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-slate-600">
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
              <FormItem className="space-y-4">
                <FormLabel className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center">
                    <Users className="w-3 h-3 text-white" />
                  </div>
                  Giới hạn sử dụng trên mỗi user
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
                    <div className="relative">
                      <Input
                        type="text"
                        className="h-14 bg-white/80 backdrop-blur-sm border border-indigo-100/60 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-300 rounded-xl pl-12 transition-all duration-300 hover:shadow-lg"
                        placeholder="VD: 5"
                        value={field.value ? String(field.value).replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\./g, "");
                          if (newValue === "" || /^\d+$/.test(newValue)) {
                            field.onChange(newValue);
                          }
                        }}
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center">
                          <Users className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-slate-600">
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
              <FormItem className="space-y-4">
                <FormLabel className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-white" />
                  </div>
                  Ngày bắt đầu
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
                    <div className="relative">
                      <Input
                        type="date"
                        className="h-14 bg-white/80 backdrop-blur-sm border border-indigo-100/60 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-300 rounded-xl pl-12 transition-all duration-300 hover:shadow-lg"
                        {...field}
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                          <Calendar className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-slate-600">
                  Ngày bắt đầu áp dụng mã giảm giá (có thể chọn ngày trong quá khứ)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Giờ bắt đầu - Smart Time Input */}
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-white" />
                  </div>
                  Giờ bắt đầu
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
                    <div className="relative">
                                            <Input
                        type="text"
                        className="h-14 bg-white/80 backdrop-blur-sm border border-indigo-100/60 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-300 rounded-xl pl-12 transition-all duration-300 hover:shadow-lg"
                        placeholder="00:00"
                        value={formatTime(startTimeValue)}
                        onChange={(e) => handleTimeChange(e, setStartTimeValue, field)}
                        onKeyDown={(e) => handleTimeKeyDown(e, startTimeValue, setStartTimeValue)}
                        maxLength={5}
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <Calendar className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-slate-600">
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
              <FormItem className="space-y-4">
                <FormLabel className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-white" />
                  </div>
                  Ngày kết thúc
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
                    <div className="relative">
                      <Input
                        type="date"
                        className="h-14 bg-white/80 backdrop-blur-sm border border-indigo-100/60 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-300 rounded-xl pl-12 transition-all duration-300 hover:shadow-lg"
                        {...field}
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
                          <Calendar className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-slate-600">
                  Ngày kết thúc áp dụng mã giảm giá (phải lớn hơn ngày bắt đầu)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Giờ kết thúc - Smart Time Input */}
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-white" />
                  </div>
                  Giờ kết thúc
                </FormLabel>
                <FormControl>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-xl transform rotate-1 transition-transform group-hover:rotate-2"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-xl transform -rotate-1 transition-transform group-hover:-rotate-2"></div>
                    <div className="relative">
                                            <Input
                        type="text"
                        className="h-14 bg-white/80 backdrop-blur-sm border border-indigo-100/60 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-300 rounded-xl pl-12 transition-all duration-300 hover:shadow-lg"
                        placeholder="00:00"
                        value={formatTime(endTimeValue)}
                        onChange={(e) => handleTimeChange(e, setEndTimeValue, field)}
                        onKeyDown={(e) => handleTimeKeyDown(e, endTimeValue, setEndTimeValue)}
                        maxLength={5}
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                          <Calendar className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-sm text-slate-600">
                  Giờ kết thúc áp dụng mã giảm giá
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 rounded-2xl transform rotate-1"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 rounded-2xl transform -rotate-1"></div>
            <div className="relative">
              <Button
                type="submit"
                className="h-14 px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-700 hover:via-purple-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Đang tạo mã giảm giá...
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 mr-3 rounded-lg bg-white/20 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    Tạo mã giảm giá
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
    </div>
  );
};

export default CouponForm; 