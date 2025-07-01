"use client";

import React, { useState, useCallback, memo, useEffect, useMemo } from "react";
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
      {/* Gradient Overlays for Scroll Indicators */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none"></div>
      
      {/* Infinite Scroll Container */}
      <div 
        className="featured-products-scroll-container overflow-x-auto scrollbar-hide scroll-smooth"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex gap-6 pb-4 min-w-max">
          {infiniteProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="flex-shrink-0 min-w-[300px] max-w-[300px]"
            >
              <ProductCardWithTimer 
                product={product}
                isCompact={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(FeaturedProductsCarousel); 