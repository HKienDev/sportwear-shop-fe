import { Product } from '@/types/product';
import Image from 'next/image';
import { useState } from 'react';

interface ProductImagesProps {
  product: Product;
}

export default function ProductImages({ product }: ProductImagesProps) {
  // Sử dụng mainImage và subImages từ product
  const mainImage = product.mainImage || '';
  const subImages = product.subImages || [];
  
  const [selectedImage, setSelectedImage] = useState(mainImage);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Hình ảnh sản phẩm</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ảnh chính */}
        <div className="relative aspect-square">
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              Không có hình ảnh
            </div>
          )}
        </div>
        
        {/* Danh sách ảnh phụ */}
        <div className="grid grid-cols-2 gap-2">
          {/* Hiển thị ảnh chính trong danh sách ảnh phụ */}
          <div 
            className={`relative aspect-square cursor-pointer border-2 ${
              selectedImage === mainImage ? 'border-blue-500' : 'border-gray-200'
            }`}
            onClick={() => setSelectedImage(mainImage)}
          >
            {mainImage ? (
              <Image
                src={mainImage}
                alt={`${product.name} - Ảnh chính`}
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                Không có ảnh
              </div>
            )}
          </div>
          
          {/* Hiển thị các ảnh phụ */}
          {subImages.map((image, index) => (
            <div 
              key={index}
              className={`relative aspect-square cursor-pointer border-2 ${
                selectedImage === image ? 'border-blue-500' : 'border-gray-200'
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`${product.name} - Ảnh ${index + 2}`}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 