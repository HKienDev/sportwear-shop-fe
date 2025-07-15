import { AdminProduct } from '@/types/product';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, ZoomIn, Grid3X3 } from 'lucide-react';

interface ProductImagesProps {
  product: AdminProduct;
}

export default function ProductImages({ product }: ProductImagesProps) {
  const mainImage = product.mainImage || '';
  const subImages = product.subImages || [];
  
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  return (
    <div className="space-y-6">
      {/* Main Image Display */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl overflow-hidden border border-slate-200">
        {selectedImage && !imageErrors.has(selectedImage) ? (
          <div className="relative w-full h-full">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={100}
              priority
              className="object-contain transition-all duration-300 hover:scale-105"
              onLoadingComplete={() => setIsLoading(false)}
              onError={() => setImageErrors(prev => new Set(prev).add(selectedImage))}
              unoptimized={selectedImage.includes('cloudinary')}
            />
            {isLoading && (
              <div className="absolute inset-0 bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center">
                <div className="flex items-center gap-2 text-slate-500">
                  <ImageIcon className="w-5 h-5 animate-pulse" />
                  <span className="text-sm">Đang tải...</span>
                </div>
              </div>
            )}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
              <ZoomIn className="w-4 h-4 text-slate-600" />
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <ImageIcon className="w-12 h-12 text-slate-400 mb-3" />
            <span className="text-slate-500 font-medium">
              {selectedImage && imageErrors.has(selectedImage) ? 'Lỗi tải ảnh' : 'Không có hình ảnh'}
            </span>
            <span className="text-xs text-slate-400 mt-1">
              {selectedImage && imageErrors.has(selectedImage) ? 'Vui lòng thử lại sau' : 'Vui lòng thêm ảnh sản phẩm'}
            </span>
          </div>
        )}
      </div>
      
      {/* Thumbnail Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Grid3X3 className="w-4 h-4" />
          <span>Hình ảnh sản phẩm ({mainImage ? 1 : 0 + subImages.length})</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {/* Main Image Thumbnail */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative aspect-square cursor-pointer rounded-xl overflow-hidden transition-all duration-300 border-2 ${
              selectedImage === mainImage 
                ? 'border-blue-500 ring-2 ring-blue-200' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => setSelectedImage(mainImage)}
          >
            {mainImage && !imageErrors.has(mainImage) ? (
              <>
                <Image
                  src={mainImage}
                  alt={`${product.name} - Ảnh chính`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  quality={90}
                  className="object-cover"
                  onError={() => setImageErrors(prev => new Set(prev).add(mainImage))}
                  unoptimized={mainImage.includes('cloudinary')}
                />
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                  Chính
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
                <ImageIcon className="w-4 h-4" />
                {mainImage && imageErrors.has(mainImage) && <span className="ml-1">Lỗi</span>}
              </div>
            )}
          </motion.div>
          
          {/* Sub Images */}
          {subImages.map((image, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative aspect-square cursor-pointer rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                selectedImage === image 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => setSelectedImage(image)}
            >
              {!imageErrors.has(image) ? (
                <Image
                  src={image}
                  alt={`${product.name} - Ảnh ${index + 2}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  quality={90}
                  className="object-cover"
                  onError={() => setImageErrors(prev => new Set(prev).add(image))}
                  unoptimized={image.includes('cloudinary')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
                  <ImageIcon className="w-4 h-4" />
                  <span className="ml-1">Lỗi</span>
                </div>
              )}
              <div className="absolute top-1 left-1 bg-slate-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                {index + 2}
              </div>
            </motion.div>
          ))}
          
          {/* Empty slots for visual balance */}
          {subImages.length < 4 && Array.from({ length: 4 - subImages.length - (mainImage ? 1 : 0) }).map((_, index) => (
            <div 
              key={`empty-${index}`}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50"
            >
              <ImageIcon className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Image Info */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600">Tổng số ảnh:</span>
            <span className="font-semibold text-slate-800">{mainImage ? 1 : 0 + subImages.length}</span>
          </div>
          <div className="text-slate-500">
            {selectedImage ? 'Đang xem ảnh được chọn' : 'Chưa chọn ảnh'}
          </div>
        </div>
      </div>
    </div>
  );
} 