import { z } from "zod";

// Schema cho tạo danh mục
export const createCategorySchema = z.object({
  name: z.string()
    .min(1, { message: 'Tên danh mục là bắt buộc' })
    .max(100, { message: 'Tên danh mục không được vượt quá 100 ký tự' }),
  slug: z.string()
    .min(1, { message: 'Slug là bắt buộc' })
    .max(100, { message: 'Slug không được vượt quá 100 ký tự' })
    .regex(/^[a-z0-9-]+$/, { message: 'Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang' }),
  description: z.string()
    .max(500, { message: 'Mô tả không được vượt quá 500 ký tự' })
    .optional(),
  parent: z.string().optional(),
  image: z.string().url({ message: 'URL hình ảnh không hợp lệ' }).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  metaTitle: z.string().max(100, { message: 'Meta title không được vượt quá 100 ký tự' }).optional(),
  metaDescription: z.string().max(200, { message: 'Meta description không được vượt quá 200 ký tự' }).optional(),
  metaKeywords: z.array(z.string()).optional()
});

// Schema cho cập nhật danh mục
export const updateCategorySchema = z.object({
  name: z.string()
    .min(1, { message: 'Tên danh mục là bắt buộc' })
    .max(100, { message: 'Tên danh mục không được vượt quá 100 ký tự' })
    .optional(),
  slug: z.string()
    .min(1, { message: 'Slug là bắt buộc' })
    .max(100, { message: 'Slug không được vượt quá 100 ký tự' })
    .regex(/^[a-z0-9-]+$/, { message: 'Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang' })
    .optional(),
  description: z.string()
    .max(500, { message: 'Mô tả không được vượt quá 500 ký tự' })
    .optional(),
  parent: z.string().optional(),
  image: z.string().url({ message: 'URL hình ảnh không hợp lệ' }).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  metaTitle: z.string().max(100, { message: 'Meta title không được vượt quá 100 ký tự' }).optional(),
  metaDescription: z.string().max(200, { message: 'Meta description không được vượt quá 200 ký tự' }).optional(),
  metaKeywords: z.array(z.string()).optional()
});

// Schema cho tìm kiếm danh mục
export const searchCategorySchema = z.object({
  keyword: z.string().optional(),
  parent: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sort: z.enum(['name', 'createdAt', 'updatedAt', 'order']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional()
}); 