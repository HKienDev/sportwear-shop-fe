"use client";

import React, { useCallback, memo, useEffect, useMemo } from "react";
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
  const displayProducts = useMemo(() => products || [], [products]);
  const count = displayProducts.length;

  // Tạo infinite loop bằng cách duplicate products
  const infiniteProducts = useMemo(() => {
    if (count === 0) return [];
    // Duplicate 3 lần để tạo hiệu ứng infinite
    return [...displayProducts, ...displayProducts, ...displayProducts];
  }, [displayProducts, count]);

  // Auto scroll effect
  useEffect(() => {
    if (count === 0) return;

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

  return (
    <div className="relative w-full overflow-hidden">
      {/* Gradient Overlays for Scroll Indicators - Mobile-first */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none"></div>
      
      {/* Responsive Carousel Container - Mobile-first */}
      <div 
        className="featured-products-scroll-container overflow-x-auto scrollbar-hide scroll-smooth"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex gap-4 sm:gap-6 md:gap-8 pb-4 sm:pb-6 min-w-max px-4 sm:px-6 md:px-8">
          {/* Mobile: 1 card, Tablet: 2 cards, Desktop: 4 cards */}
          {infiniteProducts.map((product, index) => (
            <div 
              key={`${product.id}-${index}`}
              className="flex-shrink-0"
              style={{
                width: 'calc(100vw - 2rem)', // Mobile: full width minus padding
                minWidth: 'calc(100vw - 2rem)',
                maxWidth: 'calc(100vw - 2rem)',
              }}
            >
              {/* Mobile: 1 card per slide */}
              <div className="block sm:hidden">
                <ProductCardWithTimer 
                  product={product}
                  isCompact={true}
                />
              </div>
              
              {/* Tablet: 2 cards per slide */}
              <div className="hidden sm:block lg:hidden">
                <div className="grid grid-cols-2 gap-4">
                  <ProductCardWithTimer 
                    product={product}
                    isCompact={true}
                  />
                  {infiniteProducts[index + 1] && (
                    <ProductCardWithTimer 
                      product={infiniteProducts[index + 1]}
                      isCompact={true}
                    />
                  )}
                </div>
              </div>
              
              {/* Desktop: 4 cards per slide */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-4 gap-6">
                  <ProductCardWithTimer 
                    product={product}
                    isCompact={true}
                  />
                  {infiniteProducts[index + 1] && (
                    <ProductCardWithTimer 
                      product={infiniteProducts[index + 1]}
                      isCompact={true}
                    />
                  )}
                  {infiniteProducts[index + 2] && (
                    <ProductCardWithTimer 
                      product={infiniteProducts[index + 2]}
                      isCompact={true}
                    />
                  )}
                  {infiniteProducts[index + 3] && (
                    <ProductCardWithTimer 
                      product={infiniteProducts[index + 3]}
                      isCompact={true}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(FeaturedProductsCarousel); 