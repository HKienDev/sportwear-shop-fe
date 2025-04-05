"use client";

import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import BasicInfoForm from "@/components/admin/products/add/BasicInfoForm";
import ImageUpload from "@/components/admin/products/add/ImageUpload";
import DetailInfoForm from "@/components/admin/products/add/DetailInfoForm";
import SizeColorForm from "@/components/admin/products/add/SizeColorForm";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AddProductPage() {
  const router = useRouter();
  const { formState, updateFormData, handleSubmit, fetchCategories } = useProducts();
  const categoriesFetched = useRef(false);
  
  useEffect(() => {
    // Chỉ fetch categories một lần khi component mount
    if (!categoriesFetched.current) {
      fetchCategories();
      categoriesFetched.current = true;
    }
  }, [fetchCategories]);
  
  console.log('AddProductPage - formState.categories:', formState.categories);

  const handleCancel = () => {
    router.back();
  };

  const handleProductSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
      // Chuyển hướng đến trang danh sách sản phẩm sau khi tạo thành công
      router.push('/admin/products/list');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleCancel}
              className="rounded-full hover:bg-gray-100"
              disabled={formState.isSubmitting}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Thêm Sản Phẩm Mới</h1>
              <p className="text-sm text-gray-500">Điền thông tin chi tiết về sản phẩm của bạn</p>
            </div>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={handleProductSubmit}
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Xuất bản sản phẩm
              </>
            )}
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info & Images */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">Thông Tin Cơ Bản</h2>
              </div>
              <div className="p-4">
                <BasicInfoForm 
                  formData={formState.data}
                  onFieldChange={(field, value) => {
                    console.log('Updating field:', field, 'with value:', value);
                    updateFormData(field, value);
                  }}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">Hình Ảnh Sản Phẩm</h2>
              </div>
              <div className="p-4">
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
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">Thông Tin Chi Tiết</h2>
              </div>
              <div className="p-4">
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

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">Kích Thước & Màu Sắc</h2>
              </div>
              <div className="p-4">
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