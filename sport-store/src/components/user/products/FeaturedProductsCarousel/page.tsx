"use client";

import React, { useCallback, memo, useEffect, useMemo, useState, useRef } from "react";
import ProductCardWithTimer from "../ProductCardWithTimer/page";
import { FeaturedProduct } from "@/types/product";
import { featuredProductService } from "@/services/featuredProductService";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface FeaturedProductsCarouselProps {
  products?: FeaturedProduct[];
}

const FeaturedProductsCarousel = ({ 
  products: initialProducts
}: FeaturedProductsCarouselProps) => {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch featured products from API
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching featured products...');
      const response = await featuredProductService.getFeaturedProducts(8);
      
      if (response.success && response.data?.products) {
        console.log('✅ Featured products loaded:', response.data.products.length);
        setProducts(response.data.products);
      } else {
        throw new Error(response.message || 'Không thể tải sản phẩm nổi bật');
      }
    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
      setError(error instanceof Error ? error.message : 'Lỗi khi tải sản phẩm nổi bật');
      toast.error('Không thể tải sản phẩm nổi bật');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      setLoading(false);
    } else {
      fetchFeaturedProducts();
    }
  }, [initialProducts, fetchFeaturedProducts]);

  const displayProducts = useMemo(() => products || [], [products]);
  const count = displayProducts.length;

  // Auto-scroll with pause on hover
  useEffect(() => {
    if (count === 0 || !isAutoPlaying) return;

    const autoScroll = () => {
      setCurrentIndex(prev => (prev + 1) % count);
    };

    autoPlayRef.current = setInterval(autoScroll, 5000);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [count, isAutoPlaying]);

  const handleMouseEnter = useCallback(() => {
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsAutoPlaying(true);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
    if (containerRef.current) {
      const container = containerRef.current;
      const cardWidth = container.offsetWidth;
      container.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  }, []);

  const nextSlide = useCallback(() => {
    scrollToIndex((currentIndex + 1) % count);
  }, [currentIndex, count, scrollToIndex]);

  const prevSlide = useCallback(() => {
    scrollToIndex(currentIndex === 0 ? count - 1 : currentIndex - 1);
  }, [currentIndex, count, scrollToIndex]);

  // Loading State
  if (loading) {
    return (
      <div className="w-full">
        {/* Section Header Skeleton */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded w-64 animate-pulse mx-auto"></div>
        </div>

        {/* Product Skeleton */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/5 h-64 bg-gray-200 animate-pulse"></div>
                <div className="w-full md:w-3/5 p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Không thể tải sản phẩm</h3>
              <p className="text-gray-600 mb-6">{error}</p>
            </div>
            <button 
              onClick={fetchFeaturedProducts}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (count === 0) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có sản phẩm nổi bật</h3>
            <p className="text-gray-600">Hãy quay lại sau để xem các sản phẩm đặc biệt!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sản Phẩm Nổi Bật
          </h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Khám phá những sản phẩm được ưa chuộng nhất với ưu đãi đặc biệt
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {/* Navigation Arrows */}
        {count > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-gray-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 mx-auto" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-gray-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 mx-auto" />
            </button>
          </>
        )}

        {/* Carousel */}
        <div className="flex justify-center">
          <div 
            ref={containerRef}
            className="flex gap-6 overflow-x-auto max-w-6xl mx-auto px-4"
          >
            {displayProducts.map((product, index) => (
              <div 
                key={`${product.id}-${index}`}
                className="flex-shrink-0 w-full max-w-4xl"
              >
                <ProductCardWithTimer 
                  product={product}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(FeaturedProductsCarousel); 