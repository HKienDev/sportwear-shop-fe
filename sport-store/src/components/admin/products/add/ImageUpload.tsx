import { Label } from "@/components/ui/label";
import { Upload, X, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import { ProductFormData, ProductFormErrors } from "@/types/product";
import { toast } from "sonner";

interface ImageUploadProps {
  data: Pick<ProductFormData, 'mainImage' | 'subImages'>;
  errors: Pick<ProductFormErrors, 'mainImage' | 'subImages'>;
  onChange: (field: 'mainImage' | 'subImages', value: any) => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function ImageUpload({
  data,
  errors,
  onChange,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WebP');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Kích thước file không được vượt quá 2MB');
      return false;
    }

    return true;
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'sport-store');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Không thể tải ảnh lên Cloudinary');
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    try {
      setIsUploading(true);
      const imageUrl = await uploadToCloudinary(file);
      onChange('mainImage', imageUrl);
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tải ảnh lên');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (data.subImages.length + files.length > 5) {
      toast.error('Không được phép upload quá 5 ảnh phụ');
      return;
    }

    try {
      setIsUploading(true);
      const uploadPromises = Array.from(files).map(async (file) => {
        if (!validateFile(file)) return null;
        return uploadToCloudinary(file);
      });

      const uploadedUrls = (await Promise.all(uploadPromises)).filter(Boolean) as string[];
      onChange('subImages', [...data.subImages, ...uploadedUrls]);
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tải ảnh lên');
    } finally {
      setIsUploading(false);
    }
  };

  const handleMainImageRemove = () => {
    onChange('mainImage', null);
  };

  const handleSubImageRemove = (index: number) => {
    const newSubImages = [...data.subImages];
    newSubImages.splice(index, 1);
    onChange('subImages', newSubImages);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          HÌNH ẢNH CHÍNH
        </Label>
        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          errors.mainImage 
            ? 'border-red-500 hover:border-red-600' 
            : 'border-gray-300 hover:border-blue-500'
        }`}>
          {isUploading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="mt-2 text-sm text-gray-500">Đang tải ảnh lên...</p>
            </div>
          ) : data.mainImage ? (
            <div className="relative w-48 h-48 mx-auto">
              <Image src={data.mainImage} alt="Main product" fill className="object-contain rounded-lg" />
              <button
                onClick={handleMainImageRemove}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <input type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" id="mainImage" />
              <label htmlFor="mainImage" className="cursor-pointer">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-blue-600 hover:text-blue-700">Tải lên hình ảnh</span>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG (Tối đa 2MB)</p>
              </label>
            </div>
          )}
        </div>
        {errors.mainImage && (
          <p className="text-sm text-red-500">{errors.mainImage}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          HÌNH ẢNH PHỤ
        </Label>
        <div className={`border-2 border-dashed rounded-xl p-6 transition-colors ${
          errors.subImages 
            ? 'border-red-500 hover:border-red-600' 
            : 'border-gray-300 hover:border-blue-500'
        }`}>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleSubImagesUpload} 
            className="hidden" 
            id="subImages" 
            disabled={isUploading || data.subImages.length >= 5}
          />
          <label 
            htmlFor="subImages" 
            className={`cursor-pointer block text-center mb-4 ${
              isUploading || data.subImages.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <Plus className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
              {isUploading ? 'Đang tải ảnh lên...' : 'Thêm hình ảnh phụ'}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              {data.subImages.length}/5 ảnh
            </p>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {data.subImages.map((img, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image src={img} alt={`Sub ${index + 1}`} fill className="object-cover" />
                </div>
                <button
                  onClick={() => handleSubImageRemove(index)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
        {errors.subImages && (
          <p className="text-sm text-red-500">{errors.subImages}</p>
        )}
      </div>
    </div>
  );
} 