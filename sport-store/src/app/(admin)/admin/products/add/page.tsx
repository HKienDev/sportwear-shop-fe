"use client";

import { useProducts } from "@/hooks/useProducts";
import BasicInfoForm from "@/components/admin/products/add/BasicInfoForm";
import ImageUpload from "@/components/admin/products/add/ImageUpload";
import DetailInfoForm from "@/components/admin/products/add/DetailInfoForm";
import SizeColorForm from "@/components/admin/products/add/SizeColorForm";
import SpecificationsForm from "@/components/admin/products/add/SpecificationsForm";
import { Loader2, Save, Image, FileText, Ruler } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";

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
    <div className="min-h-screen bg-white p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 rounded-3xl shadow-2xl border-4 border-white/80 overflow-hidden mb-10 relative pt-6">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4 p-6 sm:p-10">
            <div className="flex items-center gap-4">
              <Image size={32} className="text-white/90" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Thêm Sản Phẩm Mới</h1>
                <p className="text-white/80 mt-1 text-base">Điền thông tin chi tiết về sản phẩm của bạn</p>
              </div>
            </div>
            <button 
              onClick={handleProductSubmit}
              disabled={formState.isSubmitting || formState.categories.length === 0}
              className="flex items-center px-6 py-3 text-base font-semibold text-orange-600 bg-white/90 hover:bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formState.isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Xuất bản sản phẩm
                </>
              )}
            </button>
          </div>
          {/* Progress Steps */}
          <div className="relative z-10 px-6 py-5 sm:px-10">
            <div className="flex flex-col sm:flex-row justify-between gap-6">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg">
                    <FileText size={24} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-orange-500 text-xs font-bold text-orange-500">1</span>
                </div>
                <div className="ml-3">
                  <span className="font-semibold text-white">Thông tin cơ bản</span>
                  <p className="text-white/80 text-sm">Nhập thông tin sản phẩm</p>
                </div>
                <div className="hidden sm:block w-12 h-1 bg-white/30 rounded-full mx-4"></div>
              </div>
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg">
                    <Image size={24} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-red-500 text-xs font-bold text-red-500">2</span>
                </div>
                <div className="ml-3">
                  <span className="font-semibold text-white">Hình ảnh</span>
                  <p className="text-white/80 text-sm">Tải lên hình ảnh sản phẩm</p>
                </div>
                <div className="hidden sm:block w-12 h-1 bg-white/30 rounded-full mx-4"></div>
              </div>
              <div className="flex items-center">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg">
                    <Ruler size={24} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-rose-500 text-xs font-bold text-rose-500">3</span>
                </div>
                <div className="ml-3">
                  <span className="font-semibold text-white">Kích thước & màu sắc</span>
                  <p className="text-white/80 text-sm">Thêm biến thể sản phẩm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Basic Info & Images */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#F8FAFC] rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl">
              <div className="p-8">
                <BasicInfoForm 
                  formData={formState.data}
                  errors={formState.errors}
                  onFieldChange={(field, value) => updateFormData(field, value)}
                />
              </div>
            </div>
            <div className="bg-[#F8FAFC] rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl">
              <div className="p-8">
                <ImageUpload
                  formData={formState.data}
                  onFieldChange={(field, value) => updateFormData(field, value)}
                />
              </div>
            </div>
          </div>
          {/* Right Column - Details, Sizes & Colors */}
          <div className="space-y-8">
            <div className="bg-[#F8FAFC] rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl">
              <div className="p-8">
                <DetailInfoForm 
                  formData={formState.data}
                  categories={formState.categories}
                  onFieldChange={(field, value) => updateFormData(field, value)}
                />
              </div>
            </div>
            <div className="bg-[#F8FAFC] rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl">
              <div className="p-8">
                <SizeColorForm
                  formData={formState.data}
                  onFieldChange={(field, value) => updateFormData(field, value)}
                />
              </div>
            </div>
            <div className="bg-[#F8FAFC] rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl">
              <div className="p-8">
                <SpecificationsForm
                  formData={formState.data}
                  onFieldChange={(field, value) => updateFormData(field, value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 