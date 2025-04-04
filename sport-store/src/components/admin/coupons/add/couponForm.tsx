'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createCoupon } from '@/services/couponService';

const couponSchema = z.object({
    code: z.string()
        .min(3, 'Mã giảm giá phải có ít nhất 3 ký tự')
        .max(20, 'Mã giảm giá không được vượt quá 20 ký tự')
        .regex(/^[A-Z0-9_-]+$/, 'Mã giảm giá chỉ được chứa chữ hoa, số, dấu gạch ngang và dấu gạch dưới'),
    type: z.enum(['%', 'VNĐ']),
    value: z.string()
        .refine((val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num > 0;
        }, 'Giá trị giảm giá phải lớn hơn 0'),
    minimumPurchaseAmount: z.string()
        .refine((val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num >= 0;
        }, 'Giá trị tối thiểu phải lớn hơn hoặc bằng 0'),
    usageLimit: z.string()
        .refine((val) => {
            const num = parseInt(val);
            return !isNaN(num) && num > 0;
        }, 'Số lần sử dụng phải lớn hơn 0'),
    userLimit: z.string()
        .refine((val) => {
            const num = parseInt(val);
            return !isNaN(num) && num > 0;
        }, 'Số lần sử dụng trên mỗi người dùng phải lớn hơn 0'),
    startDate: z.string().refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
    }, 'Ngày bắt đầu không hợp lệ'),
    endDate: z.string().refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
    }, 'Ngày kết thúc không hợp lệ')
}).refine((data) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    return endDate > startDate;
}, {
    message: 'Ngày kết thúc phải sau ngày bắt đầu',
    path: ['endDate']
}).refine((data) => {
    if (data.type === '%') {
        const value = parseFloat(data.value);
        return value <= 100;
    }
    return true;
}, {
    message: 'Phần trăm giảm giá không được vượt quá 100%',
    path: ['value']
});

type CouponFormValues = z.infer<typeof couponSchema>;

export default function CouponForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<CouponFormValues>({
        resolver: zodResolver(couponSchema),
        defaultValues: {
            code: '',
            type: '%',
            value: '',
            minimumPurchaseAmount: '0',
            usageLimit: '1',
            userLimit: '1',
            startDate: '',
            endDate: '',
        }
    });

    const onSubmit = async (data: CouponFormValues) => {
        try {
            setIsLoading(true);
            const response = await createCoupon({
                ...data,
                value: parseFloat(data.value),
                minimumPurchaseAmount: parseFloat(data.minimumPurchaseAmount),
                usageLimit: parseInt(data.usageLimit),
                userLimit: parseInt(data.userLimit)
            });

            if (response.success) {
                toast.success('Thêm mã giảm giá thành công');
                router.push('/admin/coupons/list');
            } else {
                toast.error(response.message || 'Thêm mã giảm giá thất bại');
            }
        } catch (error) {
            console.error('Create coupon error:', error);
            toast.error('Có lỗi xảy ra khi thêm mã giảm giá');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Thêm Mã Giảm Giá Mới</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mã Giảm Giá</FormLabel>
                                        <FormControl>
                                            <Input placeholder="VD: SUMMER2024" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Loại Giảm Giá</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn loại giảm giá" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="%">Phần trăm (%)</SelectItem>
                                                <SelectItem value="VNĐ">Số tiền cố định</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {form.watch('type') === '%' ? 'Phần Trăm Giảm (%)' : 'Số Tiền Giảm (VNĐ)'}
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="minimumPurchaseAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giá Trị Tối Thiểu (VNĐ)</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" step="1000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="usageLimit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số Lần Sử Dụng</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="userLimit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số Lần Sử Dụng Trên Mỗi Người Dùng</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày Bắt Đầu</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày Kết Thúc</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô Tả</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Mô tả chi tiết về mã giảm giá..."
                                            className="min-h-[100px]"
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isLoading}
                            >
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Thêm Mã Giảm Giá
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
} 