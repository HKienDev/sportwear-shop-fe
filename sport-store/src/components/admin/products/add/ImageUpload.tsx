import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { ProductFormData } from "@/types/product";
import { toast } from "sonner";
import { safePromiseAll } from "@/utils/promiseUtils";

interface ImageUploadProps {
  formData: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: string | string[] | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const CLOUDINARY_CLOUD_NAME = 'dta6mizzm'; // Thay thế bằng cloud name của bạn
const CLOUDINARY_UPLOAD_PRESET = 'sport-store'; // Thay thế bằng upload preset của bạn

export default function ImageUpload({
  formData,
  onFieldChange,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WebP');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Kích thước file không được vượt quá ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return false;
    }

    return true;
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    try {
      console.log('🖼️ Bắt đầu upload lên Cloudinary:', file.name);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      console.log('📤 Gửi request đến Cloudinary...');
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        let errorMsg = 'Không thể tải ảnh lên Cloudinary';
        try {
          const errorData = await response.json();
          console.error('❌ Cloudinary error:', errorData);
          errorMsg = errorData.error?.message
            ? `Lỗi Cloudinary: ${errorData.error.message}`
            : errorMsg;
        } catch {
          console.error('❌ Không thể parse error response');
          errorMsg = 'Lỗi mạng hoặc Cloudinary không phản hồi';
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      console.log('✅ Upload successful:', data);
      return data.secure_url;
    } catch (error) {
      console.error('❌ Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    try {
      setIsUploading(true);
      toast.info('Đang tải ảnh lên...');
      
      console.log('🔄 Bắt đầu upload ảnh chính...');
      const imageUrl = await uploadToCloudinary(file);
      
      console.log('✅ Upload ảnh chính thành công:', imageUrl);
      onFieldChange('mainImage', imageUrl);
      toast.success('Tải ảnh lên thành công');
    } catch (err) {
      console.error('❌ Lỗi khi tải ảnh lên:', err);
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải ảnh lên';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (formData.subImages.length + files.length > 5) {
      toast.error('Không được phép upload quá 5 ảnh phụ');
      return;
    }

    try {
      setIsUploading(true);
      toast.info('Đang tải ảnh lên...');
      
      console.log('🔄 Bắt đầu upload ảnh phụ...');
      
      const uploadPromises = Array.from(files).map(async (file, index) => {
        if (!validateFile(file)) {
          console.log(`❌ File ${index + 1} không hợp lệ:`, file.name);
          return null;
        }
        console.log(`📤 Uploading file ${index + 1}:`, file.name);
        return uploadToCloudinary(file);
      });

      const result = await safePromiseAll(uploadPromises, 'Lỗi khi upload ảnh phụ');
      
      if (!result.success) {
        throw new Error(result.error || 'Lỗi khi upload ảnh phụ');
      }
      
      const uploadedUrls = (result.data || []).filter(Boolean) as string[];
      
      console.log('✅ Upload ảnh phụ thành công:', uploadedUrls);
      onFieldChange('subImages', [...formData.subImages, ...uploadedUrls]);
      
      if (uploadedUrls.length > 0) {
        toast.success(`Đã tải lên ${uploadedUrls.length} ảnh thành công`);
      }
    } catch (err) {
      console.error('❌ Lỗi khi tải ảnh lên:', err);
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải ảnh lên';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMainImageRemove = () => {
    onFieldChange('mainImage', null);
    toast.info('Đã xóa ảnh chính');
  };

  const handleSubImageRemove = (index: number) => {
    const newSubImages = [...formData.subImages];
    newSubImages.splice(index, 1);
    onFieldChange('subImages', newSubImages);
    toast.info('Đã xóa ảnh phụ');
  };

  return (
    <div className="space-y-8 border-2 border-gray-300 rounded-xl p-6 bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b-2 border-orange-200">
        <ImageIcon className="w-7 h-7 text-orange-500" />
        <h3 className="text-xl font-bold text-gray-900">Hình ảnh sản phẩm</h3>
      </div>

      {/* Main Image Upload */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold text-gray-700">Ảnh chính</Label>
          <span className="text-xs text-gray-500">
            {formData.mainImage ? "Đã tải lên" : "Chưa tải lên"}
          </span>
        </div>
        <div className="border-2 border-dashed border-orange-200 rounded-2xl p-8 text-center transition-all duration-200 hover:border-orange-500 bg-orange-50/40">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
              <p className="mt-4 text-base text-gray-600">Đang tải ảnh lên...</p>
            </div>
          ) : formData.mainImage ? (
            <div className="relative w-48 h-48 mx-auto group">
              <Image 
                src={formData.mainImage} 
                alt="Ảnh chính sản phẩm" 
                fill 
                className="object-contain rounded-xl transition-transform duration-200 group-hover:scale-105" 
              />
              <button
                onClick={handleMainImageRemove}
                className="absolute -top-3 -right-3 bg-red-500 rounded-full p-2 shadow-lg hover:bg-red-600 transition-all duration-200 hover:scale-110"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative">
                <Upload className="w-14 h-14 text-gray-400" />
              </div>
              <p className="mt-5 text-base text-gray-600">Kéo thả hoặc nhấp để tải ảnh lên</p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG hoặc WebP (tối đa 5MB)</p>
              <label className="mt-5 cursor-pointer">
                <span className="px-5 py-2 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-all duration-200 text-base font-semibold">
                  Chọn ảnh
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleMainImageUpload}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Sub Images Upload */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold text-gray-700">Ảnh phụ</Label>
          <span className="text-xs text-gray-500">
            {formData.subImages.length}/5 ảnh
          </span>
        </div>
        <div className="border-2 border-dashed border-orange-200 rounded-2xl p-8 text-center transition-all duration-200 hover:border-orange-500 bg-orange-50/40">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
              <p className="mt-4 text-base text-gray-600">Đang tải ảnh lên...</p>
            </div>
          ) : formData.subImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {formData.subImages.map((image, index) => (
                <div key={index} className="relative w-full aspect-square group">
                  <Image 
                    src={image} 
                    alt={`Ảnh phụ ${index + 1}`} 
                    fill 
                    className="object-contain rounded-xl transition-transform duration-200 group-hover:scale-105" 
                  />
                  <button
                    onClick={() => handleSubImageRemove(index)}
                    className="absolute -top-3 -right-3 bg-red-500 rounded-full p-2 shadow-lg hover:bg-red-600 transition-all duration-200 hover:scale-110"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative">
                <Upload className="w-14 h-14 text-gray-400" />
              </div>
              <p className="mt-5 text-base text-gray-600">Kéo thả hoặc nhấp để tải ảnh lên</p>
              <p className="text-xs text-gray-500 mt-1">Tối đa 5 ảnh phụ, mỗi ảnh tối đa 5MB</p>
              <label className="mt-5 cursor-pointer">
                <span className="px-5 py-2 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-all duration-200 text-base font-semibold">
                  Chọn ảnh
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleSubImagesUpload}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 