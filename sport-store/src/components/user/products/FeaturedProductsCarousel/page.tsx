"use client";

import React, { useCallback, memo, useEffect, useMemo, useState } from "react";
import ProductCardWithTimer from "../ProductCardWithTimer/page";
import { FeaturedProduct } from "@/types/product";
import { featuredProductService } from "@/services/featuredProductService";
import { toast } from "sonner";

interface FeaturedProductsCarouselProps {
  products?: FeaturedProduct[];
}

const FeaturedProductsCarousel = ({ 
  products: initialProducts
}: FeaturedProductsCarouselProps) => {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch featured products from API
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching featured products...');
      const response = await featuredProductService.getFeaturedProducts(6);
      
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
    // Nếu có initialProducts được truyền vào, sử dụng chúng
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      setLoading(false);
    } else {
      // Nếu không có, fetch từ API
      fetchFeaturedProducts();
    }
  }, [initialProducts, fetchFeaturedProducts]);

  const displayProducts = useMemo(() => products || [], [products]);
  const count = displayProducts.length;

  // Logic thông minh cho UI đẹp và responsive
  const infiniteProducts = useMemo(() => {
    if (count === 0) return [];
    
    // Nếu có 1-3 sản phẩm, không duplicate để giữ UI đẹp
    if (count <= 3) {
      return displayProducts;
    }
    
    // Nếu có nhiều sản phẩm (>3), duplicate 2 lần để tạo hiệu ứng infinite
    return [...displayProducts, ...displayProducts];
  }, [displayProducts, count]);

  // Tính toán layout dựa trên số lượng sản phẩm
  const getLayoutConfig = useMemo(() => {
    if (count === 1) {
      return {
        desktop: 'justify-center', // Căn giữa 1 sản phẩm
        tablet: 'justify-center',
        mobile: 'justify-center'
      };
    } else if (count === 2) {
      return {
        desktop: 'justify-center', // Căn giữa 2 sản phẩm
        tablet: 'justify-center',
        mobile: 'justify-start'
      };
    } else if (count === 3) {
      return {
        desktop: 'justify-center', // Căn giữa 3 sản phẩm
        tablet: 'justify-start',
        mobile: 'justify-start'
      };
    } else {
      return {
        desktop: 'justify-start', // Nhiều sản phẩm thì scroll
        tablet: 'justify-start',
        mobile: 'justify-start'
      };
    }
  }, [count]);

  // Auto scroll effect - chỉ hoạt động khi có nhiều sản phẩm
  useEffect(() => {
    if (count === 0 || count <= 3) return; // Không auto scroll khi có ít sản phẩm

    const container = document.querySelector('.featured-products-scroll-container') as HTMLElement;
    if (!container) return;

    let animationId: number;
    let scrollDirection = 1; // 1 = right, -1 = left
    const scrollSpeed = 0.8; // pixels per frame (chậm hơn categories)

    const autoScroll = () => {
      if (!container) return;

      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const maxScroll = scrollWidth - clientWidth;

      // Đổi hướng khi đến cuối hoặc đầu
      if (scrollLeft >= maxScroll) {
        scrollDirection = -1;
      } else if (scrollLeft <= 0) {
        scrollDirection = 1;
      }

      container.scrollLeft += scrollSpeed * scrollDirection;
      animationId = requestAnimationFrame(autoScroll);
    };

    // Bắt đầu auto scroll sau 3 giây (lâu hơn categories)
    const startTimeout = setTimeout(() => {
      animationId = requestAnimationFrame(autoScroll);
    }, 3000);

    return () => {
      clearTimeout(startTimeout);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [count]);

  // Pause auto scroll on hover
  const handleMouseEnter = useCallback(() => {
    const container = document.querySelector('.featured-products-scroll-container') as HTMLElement;
    if (container) {
      container.style.scrollBehavior = 'auto';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const container = document.querySelector('.featured-products-scroll-container') as HTMLElement;
    if (container) {
      container.style.scrollBehavior = 'smooth';
    }
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-4 sm:gap-6 md:gap-8 pb-4 sm:pb-6 min-w-max px-4 sm:px-6 md:px-8">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex-shrink-0">
              <div className="bg-gray-200 rounded-lg h-56 w-64 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchFeaturedProducts}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Empty state
  if (count === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Chưa có sản phẩm nổi bật</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Gradient Overlays for Scroll Indicators - chỉ hiển thị khi có nhiều sản phẩm */}
      {count > 3 && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none"></div>
        </>
      )}
      
      {/* Responsive Carousel Container - Mobile-first */}
      <div 
        className={`featured-products-scroll-container overflow-x-auto scrollbar-hide scroll-smooth ${
          count <= 3 ? 'lg:overflow-x-visible' : ''
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className={`flex gap-4 sm:gap-6 md:gap-8 pb-4 sm:pb-6 px-4 sm:px-6 md:px-8 ${
          count <= 3 ? 'lg:justify-center lg:mx-auto lg:max-w-fit' : 'min-w-max'
        }`}
        style={{
          ...(count <= 3 && {
            display: 'flex',
            justifyContent: 'center',
            margin: '0 auto',
            maxWidth: 'fit-content'
          })
        }}>
          {/* Render từng sản phẩm với responsive design */}
          {infiniteProducts.map((product, index) => (
            <div 
              key={`${product.id}-${index}`}
              className="flex-shrink-0"
              style={{
                width: '280px', // Fixed width cho mỗi card
                minWidth: '280px',
                maxWidth: '280px',
              }}
            >
              <ProductCardWithTimer 
                product={product}
                isCompact={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(FeaturedProductsCarousel); 