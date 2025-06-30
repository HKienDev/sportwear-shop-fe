"use client";

import React, { useState, useCallback, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCardWithTimer from "../ProductCardWithTimer/page";

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  sold: number;
  total: number;
  rating: number;
  image?: string;
}

interface FeaturedProductsCarouselProps {
  products?: FeaturedProduct[];
}

const FeaturedProductsCarousel = ({ 
  products = [
    {
      id: "1",
      name: "SHAMPOO, CONDITIONER & FACEWASH PACKS",
      price: 100000,
      originalPrice: 2000000,
      sold: 20,
      total: 60,
      rating: 4
    },
    {
      id: "2", 
      name: "SPORTS SHOES COLLECTION",
      price: 500000,
      originalPrice: 1200000,
      sold: 15,
      total: 50,
      rating: 5
    },
    {
      id: "3",
      name: "ATHLETIC WEAR SET",
      price: 300000,
      originalPrice: 800000,
      sold: 25,
      total: 80,
      rating: 4
    },
    {
      id: "4",
      name: "FITNESS EQUIPMENT PACK",
      price: 800000,
      originalPrice: 1500000,
      sold: 10,
      total: 30,
      rating: 5
    },
    {
      id: "5",
      name: "YOGA MAT & ACCESSORIES",
      price: 150000,
      originalPrice: 400000,
      sold: 30,
      total: 100,
      rating: 4
    },
    {
      id: "6",
      name: "RUNNING SHOES PREMIUM",
      price: 1200000,
      originalPrice: 2500000,
      sold: 8,
      total: 25,
      rating: 5
    }
  ]
}: FeaturedProductsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Responsive items per view
  const getItemsPerView = () => {
    // Luôn hiển thị 1 sản phẩm trên mọi thiết bị
    return 1;
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());
  const maxIndex = Math.max(0, products.length - itemsPerView);

  // Update items per view on resize (không cần thiết nữa nhưng giữ lại để tương thích)
  React.useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(products.length - 1, prev + 1));
  }, [products.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, products.length - 1)));
  }, [products.length]);

  // Touch/Swipe handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (e.currentTarget as HTMLElement).offsetLeft);
    setScrollLeft((e.currentTarget as HTMLElement).scrollLeft);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (e.currentTarget as HTMLElement).offsetLeft;
    const walk = (x - startX) * 2;
    (e.currentTarget as HTMLElement).scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="relative w-full">
      {/* Navigation Buttons */}
      {currentIndex > 0 && (
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-gray-200"
          aria-label="Previous products"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {currentIndex < products.length - 1 && (
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-gray-200"
          aria-label="Next products"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Carousel Container */}
      <div 
        className="overflow-hidden w-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="flex w-full transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`
          }}
        >
          {products.map((product) => (
            <div 
              key={product.id} 
              className="flex-shrink-0 w-full min-w-full"
            >
              <ProductCardWithTimer 
                product={product}
                isCompact={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {products.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: products.length }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-pink-500 w-6' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
        <div 
          className="bg-gradient-to-r from-pink-400 to-pink-500 h-1 rounded-full transition-all duration-500"
          style={{ 
            width: `${((currentIndex + 1) / products.length) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default memo(FeaturedProductsCarousel); 