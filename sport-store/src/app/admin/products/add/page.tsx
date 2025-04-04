"use client";

import { useProductForm } from "@/hooks/useProductForm";
import { Button } from "@/components/ui/button";
import BasicInfoForm from "@/components/admin/products/add/BasicInfoForm";
import ImageUpload from "@/components/admin/products/add/ImageUpload";
import DetailInfoForm from "@/components/admin/products/add/DetailInfoForm";
import SizeColorForm from "@/components/admin/products/add/SizeColorForm";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();
  const { state, updateFormData, handleSubmit } = useProductForm();

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thêm Sản Phẩm Mới</h1>
            <p className="mt-1 text-sm text-gray-500">Điền thông tin chi tiết về sản phẩm của bạn</p>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="px-6 py-2 hover:bg-gray-100 transition-colors"
              onClick={handleCancel}
              disabled={state.isSubmitting}
            >
              Huỷ bỏ
            </Button>
            <Button 
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition-colors"
              onClick={handleSubmit}
              disabled={state.isSubmitting}
            >
              {state.isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Xuất bản sản phẩm'
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <BasicInfoForm 
              data={{
                name: state.data.name,
                description: state.data.description
              }}
              errors={{
                name: state.errors.name,
                description: state.errors.description
              }}
              onChange={(field, value) => updateFormData(field, value)}
            />
            <ImageUpload
              data={{
                mainImage: state.data.mainImage,
                subImages: state.data.subImages
              }}
              errors={{
                mainImage: state.errors.mainImage,
                subImages: state.errors.subImages
              }}
              onChange={(field, value) => updateFormData(field, value)}
            />
          </div>

          <div className="space-y-6">
            <DetailInfoForm 
              data={{
                brand: state.data.brand,
                originalPrice: state.data.originalPrice,
                salePrice: state.data.salePrice,
                stock: state.data.stock,
                categoryId: state.data.categoryId,
                tags: state.data.tags
              }}
              errors={{
                brand: state.errors.brand,
                originalPrice: state.errors.originalPrice,
                salePrice: state.errors.salePrice,
                stock: state.errors.stock,
                categoryId: state.errors.categoryId,
                tags: state.errors.tags
              }}
              categories={state.categories}
              onChange={(field, value) => updateFormData(field, value)}
            />
            <SizeColorForm
              data={{
                sizes: state.data.sizes,
                colors: state.data.colors
              }}
              errors={{
                sizes: state.errors.sizes,
                colors: state.errors.colors
              }}
              onChange={(field, value) => updateFormData(field, value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 