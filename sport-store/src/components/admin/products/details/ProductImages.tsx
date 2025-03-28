import { Product } from '@/types/product';
import Image from 'next/image';
import { useState } from 'react';

interface ProductImagesProps {
  product: Product;
}

export default function ProductImages({ product }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(product.images?.main || '');

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
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Không có ảnh</p>
            </div>
          )}
        </div>

        {/* Thumbnail ảnh phụ */}
        <div className="grid grid-cols-4 gap-2">
          {/* Ảnh chính */}
          <button
            onClick={() => setSelectedImage(product.images?.main || '')}
            className={`relative aspect-square rounded-lg overflow-hidden ${
              selectedImage === product.images?.main ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            {product.images?.main ? (
              <Image
                src={product.images.main}
                alt="Ảnh chính"
                fill
                className="object-cover"
                sizes="25vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400 text-xs">Ảnh chính</p>
              </div>
            )}
          </button>

          {/* Ảnh phụ */}
          {product.images?.sub?.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`relative aspect-square rounded-lg overflow-hidden ${
                selectedImage === image ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <Image
                src={image}
                alt={`Ảnh phụ ${index + 1}`}
                fill
                className="object-cover"
                sizes="25vw"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 