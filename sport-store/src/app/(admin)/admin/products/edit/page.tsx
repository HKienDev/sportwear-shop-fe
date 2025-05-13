"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { ProductFormData, Category } from "@/types/product";
import { fetchApi } from "@/utils/api";
import BasicInfoForm from "@/components/admin/products/add/BasicInfoForm";
import DetailInfoForm from "@/components/admin/products/add/DetailInfoForm";
import SizeColorForm from "@/components/admin/products/add/SizeColorForm";
import ImageUpload from "@/components/admin/products/add/ImageUpload";
import { toast } from "react-hot-toast";
import { TOKEN_CONFIG } from '@/config/token';

export default function EditProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sku = searchParams.get('sku');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    brand: "",
    originalPrice: 0,
    salePrice: 0,
    stock: 0,
    categoryId: "",
    mainImage: null,
    subImages: [],
    colors: [],
    sizes: [],
    tags: [],
    isActive: true,
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchApi('/categories');
        if (response.success) {
          console.log('Categories fetched:', response.data);
          setCategories(response.data.categories || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        toast.error('Không thể tải danh sách danh mục');
      }
    };

    fetchCategories();
  }, []);

  // Fetch product data
  useEffect(() => {
    if (!sku) {
      setError('Không tìm thấy SKU sản phẩm');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy token từ localStorage
        const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
        
        // Kiểm tra token có tồn tại không
        if (!token) {
          toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
          router.push('/auth/login');
          return;
        }

        const response = await fetchApi(`/products/sku/${sku}`);

        if (!response.success) {
          throw new Error(response.message || 'Không thể tải thông tin sản phẩm');
        }

        const productData = response.data.product;
        
        // Chuyển đổi dữ liệu sản phẩm thành form data
        // Xử lý hình ảnh
        let mainImage = null;
        let subImages: string[] = [];
        
        if (productData.mainImage) {
          mainImage = productData.mainImage;
        } else if (Array.isArray(productData.images) && productData.images.length > 0) {
          mainImage = productData.images[0];
          subImages = productData.images.slice(1);
        } else if (productData.images?.main) {
          mainImage = productData.images.main;
          subImages = productData.images.sub || [];
        }
        
        // Xử lý kích thước và màu sắc
        const sizes = Array.isArray(productData.sizes) ? productData.sizes : [];
        const colors = Array.isArray(productData.colors) ? productData.colors : [];
        
        // Xử lý giá
        const originalPrice = productData.originalPrice || productData.price || 0;
        const salePrice = productData.salePrice || productData.discountPrice || originalPrice;
        
        // Xử lý danh mục
        const categoryId = productData.categoryId || "";
        console.log('Product categoryId:', categoryId);
        
        // Tìm danh mục tương ứng
        const categoryResponse = await fetchApi('/categories');
        if (categoryResponse.success) {
          const allCategories = categoryResponse.data.categories || [];
          console.log('All categories:', allCategories.map((cat: Category) => ({
            _id: cat._id,
            categoryId: cat.categoryId,
            name: cat.name
          })));
          setCategories(allCategories);
          
          // Kiểm tra xem categoryId có tồn tại trong danh sách không
          const categoryExists = allCategories.some((cat: Category) =>
            cat._id === categoryId || cat.categoryId === categoryId
          );
          if (!categoryExists) {
            console.warn(`Category with ID ${categoryId} not found in categories list. Available categories:`,
              allCategories.map((cat: Category) => ({
                _id: cat._id,
                categoryId: cat.categoryId,
                name: cat.name
              }))
            );
          }
        }
        
        setFormData({
          name: productData.name || "",
          description: productData.description || "",
          brand: productData.brand || "",
          originalPrice: originalPrice,
          salePrice: salePrice,
          stock: productData.stock || 0,
          categoryId: categoryId,
          mainImage: mainImage,
          subImages: subImages,
          colors: colors,
          sizes: sizes,
          tags: productData.tags || [],
          isActive: productData.isActive !== undefined ? productData.isActive : true,
        });
      } catch (err) {
        console.error('Error fetching product:', err);
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [sku, router]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Lấy token từ localStorage
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN.STORAGE_KEY);
      
      // Kiểm tra token có tồn tại không
      if (!token) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        router.push('/auth/login');
        return;
      }
      
      // Hiển thị toast đang cập nhật
      toast.loading('Đang cập nhật thông tin sản phẩm...', { id: 'updateProduct' });
      
      // Chuẩn bị dữ liệu sản phẩm
      const productData = {
        name: formData.name,
        description: formData.description,
        brand: formData.brand,
        originalPrice: formData.originalPrice,
        salePrice: formData.salePrice,
        stock: formData.stock,
        categoryId: formData.categoryId,
        mainImage: formData.mainImage,
        subImages: formData.subImages,
        colors: formData.colors,
        sizes: formData.sizes,
        tags: formData.tags,
        isActive: formData.isActive
      };
      
      // Kiểm tra xem categoryId có tồn tại không
      if (!productData.categoryId) {
        toast.error('Vui lòng chọn danh mục sản phẩm', { id: 'updateProduct' });
        setSaving(false);
        return;
      }
      
      // Kiểm tra xem categoryId có tồn tại trong danh sách categories không
      const categoryExists = categories.some(cat => 
        cat._id === productData.categoryId || cat.categoryId === productData.categoryId
      );
      if (!categoryExists) {
        console.error('Category not found in categories list:', productData.categoryId);
        console.log('Available categories:', categories.map(cat => ({ id: cat._id, name: cat.name, categoryId: cat.categoryId })));
        toast.error('Danh mục không tồn tại trong hệ thống', { id: 'updateProduct' });
        setSaving(false);
        return;
      }
      
      // Lấy thông tin danh mục để gửi lên API
      const selectedCategory = categories.find(cat => 
        cat._id === productData.categoryId || cat.categoryId === productData.categoryId
      );
      if (selectedCategory) {
        console.log('Selected category:', selectedCategory);
        // Gửi categoryId dưới dạng categoryId của danh mục thay vì _id
        productData.categoryId = selectedCategory.categoryId;
      }
      
      const response = await fetchApi(`/products/${sku}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Không thể cập nhật sản phẩm');
      }
      
      toast.success('Cập nhật sản phẩm thành công', { id: 'updateProduct' });
      router.push('/admin/products/list');
    } catch (err) {
      console.error('Error updating product:', err);
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      toast.error(errorMessage, { id: 'updateProduct' });
    } finally {
      setSaving(false);
    }
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof ProductFormData, value: ProductFormData[keyof ProductFormData]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle back button click
  const handleBack = () => {
    router.push('/admin/products/list');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4EB09D] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-red-500 text-xl mb-4">Lỗi</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-[#4EB09D] to-[#2C7A6C] hover:from-[#2C7A6C] hover:to-[#1A4A3F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4EB09D] transition-all duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-[#4EB09D] to-[#2C7A6C] p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white">Chỉnh sửa sản phẩm</h1>
                <p className="text-white/80 text-sm mt-1">Cập nhật thông tin sản phẩm</p>
              </div>
              <button
                onClick={handleBack}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4EB09D] transition-all duration-200"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Quay lại
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <BasicInfoForm 
                formData={formData}
                onFieldChange={handleFieldChange}
              />
              
              <DetailInfoForm 
                formData={formData}
                onFieldChange={handleFieldChange}
                categories={categories}
              />
              
              <SizeColorForm 
                formData={formData}
                onFieldChange={handleFieldChange}
              />
            </div>
            
            {/* Right column - Image Upload & Submit Button */}
            <div className="space-y-4">
              <ImageUpload 
                formData={formData}
                onFieldChange={handleFieldChange}
              />
              
              <div className="bg-white rounded-xl shadow-sm p-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-[#4EB09D] to-[#2C7A6C] hover:from-[#2C7A6C] hover:to-[#1A4A3F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4EB09D] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 