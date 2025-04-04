import { useState, useEffect } from 'react';
import { ProductFormData, ProductFormErrors, ProductFormState, Category } from '@/types/product';
import { toast } from 'sonner';

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  brand: '',
  originalPrice: 0,
  salePrice: 0,
  stock: 0,
  categoryId: '',
  mainImage: null,
  subImages: [],
  colors: [],
  sizes: [],
  tags: [],
  isActive: true
};

const initialErrors: ProductFormErrors = {};

export const useProductForm = () => {
  const [state, setState] = useState<ProductFormState>({
    data: initialFormData,
    errors: initialErrors,
    isLoading: false,
    isSubmitting: false,
    categories: []
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        if (data.success) {
          setState(prev => ({ ...prev, categories: data.data }));
        } else {
          toast.error('Không thể tải danh sách danh mục');
        }
      } catch (error) {
        toast.error('Đã xảy ra lỗi khi tải danh sách danh mục');
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchCategories();
  }, []);

  // Validate form
  const validateForm = (): boolean => {
    const errors: ProductFormErrors = {};
    const { data } = state;

    // Validate name
    if (!data.name) {
      errors.name = 'Tên sản phẩm là bắt buộc';
    } else if (data.name.length > 200) {
      errors.name = 'Tên sản phẩm không được vượt quá 200 ký tự';
    }

    // Validate description
    if (!data.description) {
      errors.description = 'Mô tả sản phẩm là bắt buộc';
    } else if (data.description.length > 2000) {
      errors.description = 'Mô tả không được vượt quá 2000 ký tự';
    }

    // Validate brand
    if (!data.brand) {
      errors.brand = 'Thương hiệu là bắt buộc';
    } else if (data.brand.length > 100) {
      errors.brand = 'Thương hiệu không được vượt quá 100 ký tự';
    }

    // Validate prices
    if (data.originalPrice < 0) {
      errors.originalPrice = 'Giá gốc không thể âm';
    }
    if (data.salePrice < 0) {
      errors.salePrice = 'Giá khuyến mãi không thể âm';
    }
    if (data.salePrice > data.originalPrice) {
      errors.salePrice = 'Giá khuyến mãi phải nhỏ hơn hoặc bằng giá gốc';
    }

    // Validate stock
    if (data.stock < 0) {
      errors.stock = 'Số lượng tồn kho không thể âm';
    }

    // Validate category
    if (!data.categoryId) {
      errors.categoryId = 'Danh mục là bắt buộc';
    }

    // Validate main image
    if (!data.mainImage) {
      errors.mainImage = 'Ảnh chính là bắt buộc';
    }

    // Validate sub images
    if (data.subImages.length > 5) {
      errors.subImages = 'Không được phép upload quá 5 ảnh phụ';
    }

    setState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    try {
      setState(prev => ({ ...prev, isSubmitting: true }));
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state.data),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Thêm sản phẩm thành công');
        // Reset form
        setState(prev => ({
          ...prev,
          data: initialFormData,
          errors: initialErrors,
        }));
      } else {
        toast.error(data.message || 'Đã xảy ra lỗi khi thêm sản phẩm');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi thêm sản phẩm');
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Update form data
  const updateFormData = (field: keyof ProductFormData, value: any) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      errors: { ...prev.errors, [field]: undefined }
    }));
  };

  return {
    state,
    updateFormData,
    handleSubmit,
    validateForm
  };
}; 