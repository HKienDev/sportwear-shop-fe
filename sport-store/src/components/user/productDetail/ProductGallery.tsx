import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  discountPercentage?: number;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName, discountPercentage }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative">
      <div className="bg-gray-50 rounded-lg overflow-hidden relative aspect-square">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={images[selectedImage]}
            alt={`${productName} - Hình ${selectedImage + 1}`}
            width={600}
            height={600}
            className="object-contain"
            priority
          />
        </div>
        
        <button 
          onClick={handlePrevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Previous image"
        >
          <ArrowLeft size={20} />
        </button>
        
        <button 
          onClick={handleNextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Next image"
        >
          <ArrowRight size={20} />
        </button>
        
        {discountPercentage && discountPercentage > 0 && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {discountPercentage}% off
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`border rounded-md overflow-hidden aspect-square ${
              selectedImage === index ? 'border-red-600 ring-2 ring-red-600' : 'border-gray-200'
            }`}
          >
            <Image
              src={image}
              alt={`${productName} - Hình ${index + 1}`}
              width={100}
              height={100}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery; 