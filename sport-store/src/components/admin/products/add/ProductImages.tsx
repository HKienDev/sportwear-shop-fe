import { Image as ImageIcon, Plus, X } from "lucide-react";
import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";

interface ProductImagesProps {
  additionalImages: File[];
  setAdditionalImages: (files: File[]) => void;
  onMainImageChange: (file: File | null) => void;
}

const ProductImages: React.FC<ProductImagesProps> = ({
  additionalImages,
  setAdditionalImages,
  onMainImageChange,
}) => {
  const mainImageRef = useRef<HTMLInputElement>(null);
  const additionalImagesRef = useRef<HTMLInputElement>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);

  // Xử lý khi chọn ảnh chính
  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh");
        return;
      }
      onMainImageChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý khi chọn ảnh phụ
  const handleAdditionalImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`Ảnh ${file.name} vượt quá 5MB`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        alert(`File ${file.name} không phải là ảnh`);
        return false;
      }
      return true;
    });

    if (validFiles.length + additionalImages.length > 5) {
      alert("Chỉ được chọn tối đa 5 ảnh phụ");
      return;
    }

    const newFiles = [...additionalImages, ...validFiles];
    setAdditionalImages(newFiles);

    // Tạo preview cho ảnh mới
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Xóa ảnh chính
  const handleRemoveMainImage = () => {
    onMainImageChange(null);
    setMainImagePreview("");
    if (mainImageRef.current) {
      mainImageRef.current.value = "";
    }
  };

  // Xóa ảnh phụ
  const handleRemoveAdditionalImage = (index: number) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    const newPreviews = additionalImagePreviews.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
    setAdditionalImagePreviews(newPreviews);
  };

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="card">
        <label className="input-label flex items-center">
          <ImageIcon className="mr-2 text-blue-500" size={20} />
          Hình Ảnh Sản Phẩm (Chính)
        </label>
        <div className="mt-2">
          {mainImagePreview ? (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={mainImagePreview}
                alt="Main product image"
                fill
                className="object-contain"
              />
              <button
                onClick={handleRemoveMainImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => mainImageRef.current?.click()}
              className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <Plus size={40} className="text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Click để tải lên ảnh chính</p>
              <p className="mt-1 text-xs text-gray-400">PNG, JPG, JPEG (Max 5MB)</p>
            </div>
          )}
          <input
            ref={mainImageRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleMainImageChange}
          />
        </div>
      </div>

      {/* Additional Images */}
      <div className="card">
        <label className="input-label flex items-center">
          <ImageIcon className="mr-2 text-purple-500" size={20} />
          Hình Ảnh Phụ
        </label>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Existing Images */}
          {additionalImagePreviews.map((preview, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt={`Additional image ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                onClick={() => handleRemoveAdditionalImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {/* Upload Button */}
          {additionalImagePreviews.length < 5 && (
            <div
              onClick={() => additionalImagesRef.current?.click()}
              className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors"
            >
              <Plus size={30} className="text-gray-400" />
              <p className="mt-1 text-xs text-gray-500 text-center">
                Thêm ảnh phụ
                <br />
                (Tối đa 5)
              </p>
            </div>
          )}
        </div>
        <input
          ref={additionalImagesRef}
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleAdditionalImagesChange}
        />
        <p className="mt-2 text-sm text-gray-500">
          Có thể tải lên tối đa 5 ảnh phụ. Mỗi ảnh không vượt quá 5MB.
        </p>
      </div>
    </div>
  );
};

export default ProductImages; 