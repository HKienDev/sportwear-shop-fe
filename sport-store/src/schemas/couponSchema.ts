import { z } from "zod";

// Schema cho tạo coupon
export const createCouponSchema = z.object({
  code: z.string()
    .min(3, { message: 'Mã giảm giá phải có ít nhất 3 ký tự' })
    .max(20, { message: 'Mã giảm giá không được vượt quá 20 ký tự' })
    .regex(/^[A-Z0-9_-]+$/, { message: 'Mã giảm giá chỉ được chứa chữ hoa, số, dấu gạch ngang và dấu gạch dưới' }),
  type: z.enum(['percentage', 'fixed'], { errorMap: () => ({ message: 'Loại giảm giá không hợp lệ' }) }),
  value: z.number().min(0, { message: 'Giá trị giảm giá phải lớn hơn hoặc bằng 0' }),
  minPurchase: z.number().min(0, { message: 'Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0' }).optional(),
  maxDiscount: z.number().min(0, { message: 'Giá trị giảm giá tối đa phải lớn hơn hoặc bằng 0' }).optional(),
  startDate: z.string().datetime({ message: 'Ngày bắt đầu không hợp lệ' }),
  endDate: z.string().datetime({ message: 'Ngày kết thúc không hợp lệ' }),
  usageLimit: z.number().int().min(1, { message: 'Giới hạn sử dụng phải lớn hơn 0' }).optional(),
  usedCount: z.number().int().min(0, { message: 'Số lần đã sử dụng phải lớn hơn hoặc bằng 0' }).default(0),
  isActive: z.boolean().default(true),
  description: z.string().max(500, { message: 'Mô tả không được vượt quá 500 ký tự' }).optional(),
  conditions: z.array(z.string()).optional(),
  excludedProducts: z.array(z.string()).optional(),
  excludedCategories: z.array(z.string()).optional()
}).refine(data => {
  if (data.type === 'percentage' && data.value > 100) {
    return false;
  }
  return true;
}, {
  message: 'Giá trị giảm giá theo phần trăm không được vượt quá 100%',
  path: ['value']
}).refine(data => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) < new Date(data.endDate);
  }
  return true;
}, {
  message: 'Ngày kết thúc phải sau ngày bắt đầu',
  path: ['endDate']
});

// Schema cho cập nhật coupon
export const updateCouponSchema = createCouponSchema.partial();

// Schema cho tìm kiếm coupon
export const searchCouponSchema = z.object({
  keyword: z.string().optional(),
  type: z.enum(['percentage', 'fixed']).optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  sort: z.enum(['createdAt', 'updatedAt', 'startDate', 'endDate', 'usageLimit', 'usedCount']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional()
}); 