"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, ShoppingCart, Box } from "lucide-react";
import BasicInfo from "@/components/admin/products/add/BasicInfo";
import ProductImages from "@/components/admin/products/add/ProductImages";
import ProductOrganization from "@/components/admin/products/add/ProductOrganization";
import PricingAndInventory from "@/components/admin/products/add/PricingAndInventory";
import SizesAndColors from "@/components/admin/products/add/SizesAndColors";
import { uploadFile, fetchApi } from '@/utils/api';

interface ProductFormData {
  _id?: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category: string;
  isActive: boolean;
  mainImage: File | null;
  additionalImages: File[];
  mainImageUrl?: string;
  additionalImageUrls?: string[];
  color: string[];
  size: string[];
  sku: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    brand: "",
    price: 0,
    discountPrice: 0,
    stock: 0,
    category: "",
    isActive: true,
    mainImage: null,
    additionalImages: [],
    color: [],
    size: [],
    sku: "",
    tags: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Hàm kiểm tra và nén ảnh nếu cần
  const compressImage = async (file: File): Promise<File> => {
    // Nếu file nhỏ hơn 1MB, không cần nén
    if (file.size <= 1024 * 1024) return file;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Giảm kích thước ảnh nếu quá lớn
          if (width > 1920) {
            height = Math.round((height * 1920) / width);
            width = 1920;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const newFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(newFile);
              } else {
                reject(new Error('Không thể nén ảnh'));
              }
            },
            'image/jpeg',
            0.8
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Hàm upload một ảnh
  const uploadImage = async (file: File): Promise<{ url: string }> => {
    try {
      const compressedFile = await compressImage(file);
      console.log('🔹 Uploading compressed file:', compressedFile.name);
      
      const response = await uploadFile(compressedFile, (progress) => {
        setUploadProgress(progress);
      });

      if (!response.success || !response.url) {
        throw new Error(response.message || 'Upload thất bại');
      }

      console.log('✅ Upload success:', response);
      return { url: response.url };
    } catch (error) {
      console.error('❌ Upload error:', error);
      throw error;
    }
  };

  // Hàm upload tất cả ảnh
  const uploadAllImages = async () => {
    try {
      // Upload main image
      if (!formData.mainImage) {
        throw new Error('Vui lòng chọn ảnh chính cho sản phẩm');
      }

      console.log('🔹 Uploading main image...');
      const mainImageResponse = await uploadImage(formData.mainImage);
      const mainImageUrl = mainImageResponse.url;

      // Upload additional images
      console.log('🔹 Uploading additional images...');
      const additionalImageUrls = await Promise.all(
        formData.additionalImages.map(async (file) => {
          const response = await uploadImage(file);
          return response.url;
        })
      );

      console.log('✅ All images uploaded successfully', {
        main: mainImageUrl,
        additional: additionalImageUrls
      });

      return { mainImageUrl, additionalImageUrls };
    } catch (error) {
      console.error('❌ Error uploading images:', error);
      throw new Error('Lỗi khi upload ảnh: ' + (error instanceof Error ? error.message : 'Có lỗi xảy ra'));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUploadProgress(0);
    setError(null);
    setSuccessMessage(null);
    
    try {
      setIsSubmitting(true);

      // Validate required fields
      const requiredFields: (keyof ProductFormData)[] = [
        'name', 'description', 'brand', 'price', 'stock', 
        'category', 'mainImage', 'sku'
      ];

      const missingFields = requiredFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        setError(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`);
        return;
      }

      // Upload images first
      console.log('🔹 Bắt đầu upload ảnh...');
      const { mainImageUrl, additionalImageUrls } = await uploadAllImages();
      console.log('✅ Upload ảnh thành công:', { mainImageUrl, additionalImageUrls });

      // Transform data for API
      const apiData = {
        name: formData.name,
        description: formData.description,
        brand: formData.brand,
        price: formData.price,
        discountPrice: formData.discountPrice || formData.price,
        stock: formData.stock,
        category: formData.category,
        isActive: formData.isActive,
        images: {
          main: mainImageUrl,
          sub: additionalImageUrls
        },
        color: formData.color,
        size: formData.size,
        sku: formData.sku,
        tags: formData.tags
      };

      // Log chi tiết từng trường dữ liệu
      console.log('🔍 Chi tiết dữ liệu sản phẩm:');
      console.log('- Tên:', apiData.name);
      console.log('- Mô tả:', apiData.description);
      console.log('- Thương hiệu:', apiData.brand);
      console.log('- Giá:', apiData.price);
      console.log('- Giá khuyến mãi:', apiData.discountPrice);
      console.log('- Tồn kho:', apiData.stock);
      console.log('- Danh mục:', apiData.category);
      console.log('- Trạng thái:', apiData.isActive);
      console.log('- Ảnh chính:', apiData.images.main);
      console.log('- Ảnh phụ:', apiData.images.sub);
      console.log('- Màu sắc:', apiData.color);
      console.log('- Kích thước:', apiData.size);
      console.log('- SKU:', apiData.sku);
      console.log('- Tags:', apiData.tags);

      // Kiểm tra dữ liệu trước khi gửi
      const requiredFieldsCheck = {
        name: apiData.name,
        description: apiData.description,
        brand: apiData.brand,
        price: apiData.price,
        stock: apiData.stock,
        category: apiData.category,
        'images.main': apiData.images.main,
        sku: apiData.sku
      };

      const missingFieldsCheck = Object.entries(requiredFieldsCheck)
        .filter(([, value]) => !value)
        .map(([key]) => key);

      if (missingFieldsCheck.length > 0) {
        console.error('❌ Thiếu các trường:', missingFieldsCheck);
        setError(`Vui lòng điền đầy đủ thông tin: ${missingFieldsCheck.join(', ')}`);
        return;
      }

      // Validate giá và tồn kho
      if (apiData.price <= 0) {
        setError('Giá sản phẩm phải lớn hơn 0');
        return;
      }

      if (apiData.stock < 0) {
        setError('Tồn kho không thể âm');
        return;
      }

      // Gọi API tạo sản phẩm
      console.log('🔹 Gọi API tạo sản phẩm...');
      const response = await fetchApi('/products', {
        method: 'POST',
        body: JSON.stringify(apiData)
      });

      if (!response.success) {
        throw new Error(response.message || 'Có lỗi xảy ra khi tạo sản phẩm');
      }

      setSuccessMessage('Sản phẩm đã được tạo thành công!');
      router.push('/admin/products/list');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      console.error('❌ Lỗi:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center">
            <Box className="mr-3 text-blue-600" size={32} />
            Chi Tiết Sản Phẩm
          </h1>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => router.back()}
              className="btn-secondary whitespace-nowrap"
            >
              <X className="mr-2" size={18} />
              Hủy bỏ
            </button>
            <button 
              className="btn-primary whitespace-nowrap"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <ShoppingCart className="mr-2" size={18} />
              {isSubmitting ? 'Đang xử lý...' : 'Xuất bản sản phẩm'}
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Upload Progress */}
        {isSubmitting && uploadProgress > 0 && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Đang tải ảnh lên... {Math.round(uploadProgress)}%
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Product Info */}
          <div className="lg:col-span-2 space-y-6">
            <BasicInfo
              name={formData.name}
              description={formData.description}
              brand={formData.brand}
              sku={formData.sku}
              onNameChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
              onDescriptionChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
              onBrandChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}
              onSkuChange={(value) => setFormData(prev => ({ ...prev, sku: value }))}
            />
            <ProductImages
              additionalImages={formData.additionalImages}
              setAdditionalImages={(files: File[]) => setFormData(prev => ({ ...prev, additionalImages: files }))}
              onMainImageChange={(file) => setFormData(prev => ({ ...prev, mainImage: file }))}
            />
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            <ProductOrganization
              category={formData.category}
              isActive={formData.isActive}
              tags={formData.tags}
              onCategoryChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              onIsActiveChange={(value) => setFormData(prev => ({ ...prev, isActive: value }))}
              onTagsChange={(value) => setFormData(prev => ({ ...prev, tags: value }))}
            />
            <PricingAndInventory
              originalPrice={formData.price}
              salePrice={formData.discountPrice}
              stock={formData.stock}
              onOriginalPriceChange={(value) => setFormData(prev => ({ ...prev, price: value }))}
              onSalePriceChange={(value) => setFormData(prev => ({ ...prev, discountPrice: value }))}
              onStockChange={(value) => setFormData(prev => ({ ...prev, stock: value }))}
            />
            <SizesAndColors
              sizes={formData.size}
              colors={formData.color}
              onSizesChange={(value) => setFormData(prev => ({ ...prev, size: value }))}
              onColorsChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}