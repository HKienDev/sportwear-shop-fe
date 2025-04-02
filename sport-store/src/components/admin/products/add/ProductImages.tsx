import { Image, Upload, X, HelpCircle } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { toast } from "react-hot-toast";

interface ProductImagesProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export default function ProductImages({ images, onImagesChange }: ProductImagesProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error('Vui lòng chọn file ảnh hợp lệ');
      return;
    }

    try {
      const formData = new FormData();
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onImagesChange([...images, ...data.urls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Có lỗi xảy ra khi tải ảnh lên');
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold flex items-center text-gray-900">
          <Image className="mr-2 text-blue-500" size={24} />
          Hình Ảnh Sản Phẩm
        </h2>
        <p className="mt-1 text-sm text-gray-500">Tải lên hình ảnh sản phẩm của bạn</p>
      </div>

      <div className="p-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-gray-600">
                Kéo và thả ảnh vào đây hoặc{' '}
                <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                  <span>chọn file</span>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500">
                Hỗ trợ: JPG, PNG, GIF (Tối đa 5MB)
              </p>
            </div>
          </div>
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700 flex items-center">
                <Image className="mr-2 h-4 w-4 text-gray-500" />
                Hình ảnh đã tải lên
                <Tooltip content="Bạn có thể kéo thả để sắp xếp lại thứ tự ảnh">
                  <HelpCircle className="ml-2 h-4 w-4 text-gray-400" />
                </Tooltip>
              </h3>
              <span className="text-sm text-gray-500">
                {images.length} / 10 ảnh
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 