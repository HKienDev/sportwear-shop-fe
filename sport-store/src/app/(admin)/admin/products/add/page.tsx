"use client";

import { useProducts } from "@/hooks/useProducts";
import BasicInfoForm from "@/components/admin/products/add/BasicInfoForm";
import ImageUpload from "@/components/admin/products/add/ImageUpload";
import DetailInfoForm from "@/components/admin/products/add/DetailInfoForm";
import SizeColorForm from "@/components/admin/products/add/SizeColorForm";
import { Loader2, Save, Image, FileText, Ruler } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function AddProductPage() {
  const router = useRouter();
  const { formState, updateFormData, handleSubmit, fetchCategories } = useProducts();
  const categoriesFetched = useRef(false);
  const { user, isAuthenticated, loading } = useAuth();
  
  useEffect(() => {
    // Chỉ fetch categories một lần khi component mount
    if (!categoriesFetched.current) {
      fetchCategories();
      categoriesFetched.current = true;
    }
  }, [fetchCategories]);
  
  console.log('AddProductPage - formState.categories:', formState.categories);

  if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
    router.push('/admin/login');
    return null;
  }

  const handleProductSubmit = async () => {
    console.log('Submitting product form...');
    console.log('Current form state:', formState);
    
    try {
      const success = await handleSubmit();
      console.log('Product submission result:', success);
      
      if (success) {
        // Chuyển hướng đến trang danh sách sản phẩm sau khi tạo thành công
        router.push('/admin/products/list');
      } else {
        // Hiển thị thông báo lỗi nếu không thành công
        toast.error('Không thể tạo sản phẩm. Vui lòng kiểm tra lại thông tin và thử lại.');
      }
    } catch (error) {
      console.error('Error in handleProductSubmit:', error);
      toast.error('Đã xảy ra lỗi khi tạo sản phẩm: ' + (error instanceof Error ? error.message : 'Lỗi không xác định'));
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image size={28} className="text-white/90 mr-3" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Thêm Sản Phẩm Mới</h1>
                </div>
                <p className="text-white/80 mt-2 ml-1">Điền thông tin chi tiết về sản phẩm của bạn</p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleProductSubmit}
                  disabled={formState.isSubmitting || formState.categories.length === 0}
                  className="flex items-center px-4 py-2 text-sm font-medium text-orange-600 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-all disabled:opacity-50"
                >
                  {formState.isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Xuất bản sản phẩm
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="px-6 py-5 sm:px-8">
            <div className="flex flex-col sm:flex-row justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
                    <FileText size={24} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 border-orange-500 text-[10px] font-bold text-orange-500">1</span>
                </div>
                <div className="ml-3">
                  <span className="font-medium text-gray-900">Thông tin cơ bản</span>
                  <p className="text-xs text-gray-500">Nhập thông tin sản phẩm</p>
                </div>
                <div className="hidden sm:block w-12 h-1 bg-gradient-to-r from-orange-200 to-red-200 mx-2"></div>
              </div>
              
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg">
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image size={24} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 border-red-500 text-[10px] font-bold text-red-500">2</span>
                </div>
                <div className="ml-3">
                  <span className="font-medium text-gray-900">Hình ảnh</span>
                  <p className="text-xs text-gray-500">Tải lên hình ảnh sản phẩm</p>
                </div>
                <div className="hidden sm:block w-12 h-1 bg-gradient-to-r from-red-200 to-rose-200 mx-2"></div>
              </div>
              
              <div className="flex items-center">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg">
                    <Ruler size={24} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 border-rose-500 text-[10px] font-bold text-rose-500">3</span>
                </div>
                <div className="ml-3">
                  <span className="font-medium text-gray-900">Kích thước & màu sắc</span>
                  <p className="text-xs text-gray-500">Thêm biến thể sản phẩm</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info & Images */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
              <div className="p-6">
                <BasicInfoForm 
                  formData={formState.data}
                  errors={formState.errors}
                  onFieldChange={(field, value) => {
                    console.log('Updating field:', field, 'with value:', value);
                    updateFormData(field, value);
                  }}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
              <div className="p-6">
                <ImageUpload
                  formData={formState.data}
                  onFieldChange={(field, value) => {
                    console.log('Updating field:', field, 'with value:', value);
                    updateFormData(field, value);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Details, Sizes & Colors */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
              <div className="p-6">
                <DetailInfoForm 
                  formData={formState.data}
                  categories={formState.categories}
                  onFieldChange={(field, value) => {
                    console.log('Updating field:', field, 'with value:', value);
                    updateFormData(field, value);
                  }}
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
              <div className="p-6">
                <SizeColorForm
                  formData={formState.data}
                  onFieldChange={(field, value) => {
                    console.log('Updating field:', field, 'with value:', value);
                    updateFormData(field, value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 