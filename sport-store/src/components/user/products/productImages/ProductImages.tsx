import React, { useState } from 'react';
import Image from 'next/image';

interface ProductImagesProps {
  mainImage: string;
  subImages?: string[];
  productName: string;
}

export const ProductImages: React.FC<ProductImagesProps> = ({
  mainImage,
  subImages = [],
  productName,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(mainImage);

  return (
    <div className="space-y-4">
      <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
        <Image
          src={selectedImage || mainImage || "/default-image.png"}
          alt={productName}
          fill
          className="object-cover"
          priority
        />
      </div>
      {subImages && subImages.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          <div 
            className="relative h-20 cursor-pointer rounded-lg overflow-hidden"
            onClick={() => setSelectedImage(mainImage)}
          >
            <Image
              src={mainImage || "/default-image.png"}
              alt={productName}
              fill
              className="object-cover"
            />
          </div>
          {subImages.map((image: string, index: number) => (
            <div 
              key={index}
              className="relative h-20 cursor-pointer rounded-lg overflow-hidden"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image}
                alt={`${productName} - ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 