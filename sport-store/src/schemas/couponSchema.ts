import { z } from "zod";

// Schema cho coupon
export const couponSchema = z
  .object({
    code: z.string().min(1, "Mã giảm giá không được để trống"),
    type: z.enum(["percentage", "fixed"], {
      required_error: "Loại giảm giá không được để trống",
      invalid_type_error: "Loại giảm giá không hợp lệ",
    }),
    value: z.number().min(0, "Giá trị giảm giá phải lớn hơn hoặc bằng 0"),
    minPurchase: z
      .number()
      .min(0, "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0")
      .optional(),
    maxDiscount: z
      .number()
      .min(0, "Giá trị giảm giá tối đa phải lớn hơn hoặc bằng 0")
      .optional(),
    usageLimit: z
      .number()
      .min(1, "Số lần sử dụng tối đa phải lớn hơn 0")
      .optional(),
    userLimit: z
      .number()
      .min(1, "Số lần sử dụng tối đa cho mỗi người phải lớn hơn 0")
      .optional(),
    startDate: z.string().min(1, "Ngày bắt đầu không được để trống"),
    endDate: z.string().min(1, "Ngày kết thúc không được để trống"),
    description: z.string().optional(),
    status: z.enum(["active", "inactive", "expired"]).optional(),
    excludedProducts: z.array(z.string()).optional(),
    excludedCategories: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.type === "percentage") {
        return data.value >= 0 && data.value <= 100;
      }
      return true;
    },
    {
      message: "Giá trị giảm giá theo phần trăm phải từ 0 đến 100",
      path: ["value"],
    }
  )
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start < end;
    },
    {
      message: "Ngày kết thúc phải sau ngày bắt đầu",
      path: ["endDate"],
    }
  )
  .transform((data) => ({
    ...data,
    status: data.status || "active",
  }));

// Tạo schema cho việc cập nhật coupon bằng cách tạo một schema mới
export const updateCouponSchema = z.object({
  code: z.string().min(1, "Mã giảm giá không được để trống").optional(),
  type: z.enum(["percentage", "fixed"]).optional(),
  value: z.number().min(0, "Giá trị giảm giá phải lớn hơn hoặc bằng 0").optional(),
  minPurchase: z
    .number()
    .min(0, "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0")
    .optional(),
  maxDiscount: z
    .number()
    .min(0, "Giá trị giảm giá tối đa phải lớn hơn hoặc bằng 0")
    .optional(),
  usageLimit: z
    .number()
    .min(1, "Số lần sử dụng tối đa phải lớn hơn 0")
    .optional(),
  userLimit: z
    .number()
    .min(1, "Số lần sử dụng tối đa cho mỗi người phải lớn hơn 0")
    .optional(),
  startDate: z.string().min(1, "Ngày bắt đầu không được để trống").optional(),
  endDate: z.string().min(1, "Ngày kết thúc không được để trống").optional(),
  description: z.string().optional(),
  status: z.enum(["active", "inactive", "expired"]).optional(),
  excludedProducts: z.array(z.string()).optional(),
  excludedCategories: z.array(z.string()).optional(),
})
.refine(
  (data) => {
    if (data.type === "percentage" && data.value !== undefined) {
      return data.value >= 0 && data.value <= 100;
    }
    return true;
  },
  {
    message: "Giá trị giảm giá theo phần trăm phải từ 0 đến 100",
    path: ["value"],
  }
)
.refine(
  (data) => {
    if (!data.startDate || !data.endDate) return true;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return start < end;
  },
  {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["endDate"],
  }
)
.transform((data) => ({
  ...data,
  status: data.status || "active",
}));

// Type cho coupon
export type CouponType = z.infer<typeof couponSchema>;

// Type cho việc cập nhật coupon
export type UpdateCouponType = z.infer<typeof updateCouponSchema>;

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

// Schema cho áp dụng coupon
export const applyCouponSchema = z.object({
    code: z.string()
        .min(3, { message: 'Mã giảm giá phải có ít nhất 3 ký tự' })
        .max(20, { message: 'Mã giảm giá không được vượt quá 20 ký tự' })
        .regex(/^[A-Z0-9_-]+$/, { message: 'Mã giảm giá chỉ được chứa chữ hoa, số, dấu gạch ngang và dấu gạch dưới' }),
    amount: z.number()
        .min(0, { message: 'Số tiền đơn hàng phải lớn hơn hoặc bằng 0' })
});

// Schema cho kiểm tra coupon
export const validateCouponSchema = z.object({
    code: z.string()
        .min(3, { message: 'Mã giảm giá phải có ít nhất 3 ký tự' })
        .max(20, { message: 'Mã giảm giá không được vượt quá 20 ký tự' })
        .regex(/^[A-Z0-9_-]+$/, { message: 'Mã giảm giá chỉ được chứa chữ hoa, số, dấu gạch ngang và dấu gạch dưới' }),
    amount: z.number()
        .min(0, { message: 'Số tiền đơn hàng phải lớn hơn hoặc bằng 0' })
});

// Schema cho sử dụng coupon
export const useCouponSchema = z.object({
    code: z.string()
        .min(3, { message: 'Mã giảm giá phải có ít nhất 3 ký tự' })
        .max(20, { message: 'Mã giảm giá không được vượt quá 20 ký tự' })
        .regex(/^[A-Z0-9_-]+$/, { message: 'Mã giảm giá chỉ được chứa chữ hoa, số, dấu gạch ngang và dấu gạch dưới' }),
    orderId: z.string()
        .min(1, { message: 'ID đơn hàng không được để trống' })
}); 