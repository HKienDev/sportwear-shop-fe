import { z } from "zod";

// Schema cho tạo sản phẩm
export const createProductSchema = z.object({
  name: z.string()
    .min(1, { message: 'Tên sản phẩm là bắt buộc' })
    .max(200, { message: 'Tên sản phẩm không được vượt quá 200 ký tự' }),
  description: z.string()
    .min(1, { message: 'Mô tả sản phẩm là bắt buộc' })
    .max(2000, { message: 'Mô tả sản phẩm không được vượt quá 2000 ký tự' }),
  price: z.number()
    .min(0, { message: 'Giá sản phẩm không được âm' }),
  category: z.string()
    .min(1, { message: 'Danh mục sản phẩm là bắt buộc' }),
  brand: z.string()
    .min(1, { message: 'Thương hiệu sản phẩm là bắt buộc' }),
  stock: z.number()
    .int()
    .min(0, { message: 'Số lượng tồn kho không được âm' }),
  sku: z.string()
    .min(1, { message: 'Mã SKU là bắt buộc' })
    .max(50, { message: 'Mã SKU không được vượt quá 50 ký tự' }),
  discount: z.number()
    .min(0, { message: 'Giảm giá không được âm' })
    .max(100, { message: 'Giảm giá không được vượt quá 100%' })
    .optional(),
  images: z.array(z.string().url({ message: 'URL hình ảnh không hợp lệ' }))
    .min(1, { message: 'Sản phẩm phải có ít nhất 1 hình ảnh' }),
  attributes: z.record(z.string(), z.any()).optional(),
  specifications: z.record(z.string(), z.any()).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().max(100, { message: 'Meta title không được vượt quá 100 ký tự' }).optional(),
  metaDescription: z.string().max(200, { message: 'Meta description không được vượt quá 200 ký tự' }).optional(),
  metaKeywords: z.array(z.string()).optional()
});

// Schema cho cập nhật sản phẩm
export const updateProductSchema = z.object({
  name: z.string()
    .min(1, { message: 'Tên sản phẩm là bắt buộc' })
    .max(200, { message: 'Tên sản phẩm không được vượt quá 200 ký tự' })
    .optional(),
  description: z.string()
    .min(1, { message: 'Mô tả sản phẩm là bắt buộc' })
    .max(2000, { message: 'Mô tả sản phẩm không được vượt quá 2000 ký tự' })
    .optional(),
  price: z.number()
    .min(0, { message: 'Giá sản phẩm không được âm' })
    .optional(),
  category: z.string()
    .min(1, { message: 'Danh mục sản phẩm là bắt buộc' })
    .optional(),
  brand: z.string()
    .min(1, { message: 'Thương hiệu sản phẩm là bắt buộc' })
    .optional(),
  stock: z.number()
    .int()
    .min(0, { message: 'Số lượng tồn kho không được âm' })
    .optional(),
  sku: z.string()
    .min(1, { message: 'Mã SKU là bắt buộc' })
    .max(50, { message: 'Mã SKU không được vượt quá 50 ký tự' })
    .optional(),
  discount: z.number()
    .min(0, { message: 'Giảm giá không được âm' })
    .max(100, { message: 'Giảm giá không được vượt quá 100%' })
    .optional(),
  images: z.array(z.string().url({ message: 'URL hình ảnh không hợp lệ' }))
    .min(1, { message: 'Sản phẩm phải có ít nhất 1 hình ảnh' })
    .optional(),
  attributes: z.record(z.string(), z.any()).optional(),
  specifications: z.record(z.string(), z.any()).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  metaTitle: z.string().max(100, { message: 'Meta title không được vượt quá 100 ký tự' }).optional(),
  metaDescription: z.string().max(200, { message: 'Meta description không được vượt quá 200 ký tự' }).optional(),
  metaKeywords: z.array(z.string()).optional()
});

// Schema cho tìm kiếm sản phẩm
export const searchProductSchema = z.object({
  keyword: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sort: z.enum(['name', 'price', 'createdAt', 'updatedAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional()
}); 