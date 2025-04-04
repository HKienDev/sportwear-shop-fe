import { z } from "zod";

// Schema cho item trong giỏ hàng
const cartItemSchema = z.object({
  product: z.string().min(1, { message: 'ID sản phẩm là bắt buộc' }),
  quantity: z.number().int().min(1, { message: 'Số lượng phải lớn hơn 0' }),
  attributes: z.record(z.string(), z.any()).optional()
});

// Schema cho tạo giỏ hàng
export const createCartSchema = z.object({
  user: z.string().min(1, { message: 'ID người dùng là bắt buộc' }),
  items: z.array(cartItemSchema).min(1, { message: 'Giỏ hàng phải có ít nhất một sản phẩm' }),
  coupon: z.string().optional(),
  note: z.string().max(500, { message: 'Ghi chú không được vượt quá 500 ký tự' }).optional()
});

// Schema cho cập nhật giỏ hàng
export const updateCartSchema = z.object({
  items: z.array(cartItemSchema).optional(),
  coupon: z.string().optional(),
  note: z.string().max(500).optional()
});

// Schema cho thêm sản phẩm vào giỏ hàng
export const addToCartSchema = z.object({
  product: z.string().min(1, { message: 'ID sản phẩm là bắt buộc' }),
  quantity: z.number().int().min(1, { message: 'Số lượng phải lớn hơn 0' }),
  attributes: z.record(z.string(), z.any()).optional()
});

// Schema cho cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, { message: 'Số lượng phải lớn hơn 0' }),
  attributes: z.record(z.string(), z.any()).optional()
}); 