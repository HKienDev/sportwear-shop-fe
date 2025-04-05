"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Product, ProductFormData } from "@/types/product";
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
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
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

  // Fetch product data
  useEffect(() => {
    if (!id) {
      setError('Không tìm thấy ID sản phẩm');
      toast.error('Không tìm thấy ID sản phẩm');
      router.push('/admin/products/list');
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

        console.log('Fetching product with ID:', id);
        const response = await fetchApi(`/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('API response:', response);
        
        if (!response.success) {
          throw new Error(response.message || 'Không thể tải thông tin sản phẩm');
        }

        if (!response.data) {
          throw new Error('Không tìm thấy thông tin sản phẩm');
        }

        const productData = response.data;
        setProduct(productData);
        
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
        const categoryId = productData.category || productData.categoryId || "";
        
        console.log('Processed product data:', {
          mainImage,
          subImages,
          sizes,
          colors,
          originalPrice,
          salePrice,
          categoryId
        });
        
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
  }, [id, router]);

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
      
      // Chuẩn bị dữ liệu sản phẩm
      const productData = {
        name: formData.name,
        description: formData.description,
        brand: formData.brand,
        originalPrice: formData.originalPrice,
        salePrice: formData.salePrice,
        stock: formData.stock,
        category: formData.categoryId,
        mainImage: formData.mainImage,
        subImages: formData.subImages,
        colors: formData.colors,
        sizes: formData.sizes,
        tags: formData.tags,
        isActive: formData.isActive
      };
      
      console.log('Updating product with data:', productData);
      
      const response = await fetchApi(`/products/${id}`, {
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
      
      toast.success('Cập nhật sản phẩm thành công');
      router.push('/admin/products/list');
    } catch (err) {
      console.error('Error updating product:', err);
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Handle form field changes
  const handleFieldChange = (field: keyof ProductFormData, value: any) => {
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
            {/* Left column - Basic Info & Detail Info */}
            <div className="lg:col-span-2 space-y-4">
              <BasicInfoForm 
                formData={formData}
                onFieldChange={handleFieldChange}
              />
              
              <DetailInfoForm 
                formData={formData}
                onFieldChange={handleFieldChange}
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