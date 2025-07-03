import { AdminProduct } from '@/types/product';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ProductImagesProps {
  product: AdminProduct;
}

export default function ProductImages({ product }: ProductImagesProps) {
  const mainImage = product.mainImage || '';
  const subImages = product.subImages || [];
  
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      <div className="flex flex-col gap-8">
        {/* Main Image */}
        <div className="relative aspect-square w-full">
          {selectedImage ? (
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                sizes="100vw"
                quality={100}
                priority
                className="object-contain transition-transform duration-300"
                onLoadingComplete={() => setIsLoading(false)}
              />
              {isLoading && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <span className="text-gray-400">Không có hình ảnh</span>
            </div>
          )}
        </div>
        
        {/* Thumbnail Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* Main Image Thumbnail */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
              selectedImage === mainImage 
                ? 'ring-2 ring-blue-500 ring-offset-2' 
                : 'hover:ring-2 hover:ring-gray-200'
            }`}
            onClick={() => setSelectedImage(mainImage)}
          >
            {mainImage ? (
              <Image
                src={mainImage}
                alt={`${product.name} - Ảnh chính`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={90}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                Không có ảnh
              </div>
            )}
          </motion.div>
          
          {/* Sub Images */}
          {subImages.map((image, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
                selectedImage === image 
                  ? 'ring-2 ring-blue-500 ring-offset-2' 
                  : 'hover:ring-2 hover:ring-gray-200'
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`${product.name} - Ảnh ${index + 2}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={90}
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 