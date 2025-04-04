import { z } from "zod";

// Schema cho tạo review
export const createReviewSchema = z.object({
  user: z.string().min(1, { message: 'ID người dùng là bắt buộc' }),
  product: z.string().min(1, { message: 'ID sản phẩm là bắt buộc' }),
  order: z.string().min(1, { message: 'ID đơn hàng là bắt buộc' }),
  rating: z.number().min(1, { message: 'Đánh giá phải từ 1-5 sao' }).max(5, { message: 'Đánh giá phải từ 1-5 sao' }),
  title: z.string().min(1, { message: 'Tiêu đề là bắt buộc' }).max(100, { message: 'Tiêu đề không được vượt quá 100 ký tự' }),
  content: z.string().min(10, { message: 'Nội dung phải có ít nhất 10 ký tự' }).max(1000, { message: 'Nội dung không được vượt quá 1000 ký tự' }),
  images: z.array(z.string().url({ message: 'URL hình ảnh không hợp lệ' })).optional(),
  isVerified: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  likes: z.number().int().min(0).default(0),
  dislikes: z.number().int().min(0).default(0)
});

// Schema cho cập nhật review
export const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  title: z.string().min(1).max(100).optional(),
  content: z.string().min(10).max(1000).optional(),
  images: z.array(z.string().url()).optional(),
  isPublic: z.boolean().optional()
});

// Schema cho tìm kiếm review
export const searchReviewSchema = z.object({
  keyword: z.string().optional(),
  product: z.string().optional(),
  user: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  isVerified: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  sort: z.enum(['createdAt', 'updatedAt', 'rating', 'likes', 'dislikes']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional()
}); 