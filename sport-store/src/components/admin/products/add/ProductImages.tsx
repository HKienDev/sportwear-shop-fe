import { Image as ImageIcon, Upload, Trash2, Loader2 } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface ProductImagesProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export default function ProductImages({
  images,
  onImagesChange,
}: ProductImagesProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      acceptedFiles.forEach((file) => {
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
    } catch (err) {
      setError('Không thể tải lên ảnh. Vui lòng thử lại.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }, [images, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <div className="card bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <h2 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
        <ImageIcon className="mr-2 text-pink-500" size={24} />
        Hình Ảnh Sản Phẩm
      </h2>

      <div className="space-y-6">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
            isDragActive
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-300 hover:border-pink-500'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? 'Thả ảnh vào đây...'
              : 'Kéo thả ảnh vào đây hoặc click để chọn'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Hỗ trợ: PNG, JPG, JPEG, GIF (tối đa 5MB)
          </p>
        </div>

        {/* Uploading State */}
        {uploading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Tổng Kết</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Số lượng ảnh:</span>
              <span className="font-medium">{images.length} ảnh</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Trạng thái:</span>
              <span className="font-medium">
                {uploading ? 'Đang tải lên...' : 'Sẵn sàng'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 