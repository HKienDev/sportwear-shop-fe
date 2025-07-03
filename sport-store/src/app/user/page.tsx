"use client";

import React, { useEffect, useState, useMemo, useCallback, memo, Suspense } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SafeIcons } from "@/utils/safeIcons";
import ProductCard from "@/components/user/products/productCard/page";
import FeaturedProductsCarousel from "@/components/user/products/FeaturedProductsCarousel/page";
import { useAuth } from "@/context/authContext";
import { UserProduct } from "@/types/product";
import { userProductService } from "@/services/userProductService";
import { categoryService } from "@/services/categoryService";
import { Category } from "@/types/category";

// Type definitions for API responses
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface UserProductsResponse {
  products: UserProduct[];
  total?: number;
  page?: number;
  limit?: number;
}

interface CategoriesResponse {
  categories: Category[];
  total?: number;
}
import Skeleton from "@/components/common/Skeleton";
import { NumberTicker } from "@/components/magicui/number-ticker";

// Thêm khai báo cho window.__checkedAuth
declare global {
  interface Window {
    __checkedAuth?: boolean;
  }
}

// Categories Showcase Component - Mobile-first Responsive
const CategoriesShowcase = memo(({ categories }: { categories: Category[] }) => {
  const displayCategories = useMemo(() => categories || [], [categories]);
  const count = displayCategories.length;

  const infiniteCategories = useMemo(() => {
    if (count === 0) return [];
    return [...displayCategories, ...displayCategories, ...displayCategories];
  }, [displayCategories, count]);

  useEffect(() => {
    if (count === 0) return;

    const container = document.querySelector('.categories-scroll-container') as HTMLElement;
    if (!container) return;

    let animationId: number;
    let scrollDirection = 1;
    const scrollSpeed = 1;

    const autoScroll = () => {
      if (!container) return;

      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const maxScroll = scrollWidth - clientWidth;

      if (scrollLeft >= maxScroll) {
        scrollDirection = -1;
      } else if (scrollLeft <= 0) {
        scrollDirection = 1;
      }

      container.scrollLeft += scrollSpeed * scrollDirection;
      animationId = requestAnimationFrame(autoScroll);
    };

    const startTimeout = setTimeout(() => {
      animationId = requestAnimationFrame(autoScroll);
    }, 2000);

    return () => {
      clearTimeout(startTimeout);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [count]);

  const handleMouseEnter = useCallback(() => {
    const container = document.querySelector('.categories-scroll-container') as HTMLElement;
    if (container) {
      container.style.scrollBehavior = 'auto';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const container = document.querySelector('.categories-scroll-container') as HTMLElement;
    if (container) {
      container.style.scrollBehavior = 'smooth';
    }
  }, []);

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 xl:py-6">
        {/* Header Section - Mobile-first */}
        <div className="text-center mb-2 sm:mb-3 lg:mb-4 xl:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 leading-tight">
            Danh Mục Sản Phẩm
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 leading-relaxed">
            Khám phá đa dạng sản phẩm thể thao chất lượng cao từ các thương hiệu uy tín
          </p>
        </div>
        
        {/* Infinite Horizontal Scrolling Container - Mobile-first */}
        <div className="relative overflow-hidden">
          {/* Gradient Overlays for Scroll Indicators - Mobile-first */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none"></div>
          
          {/* Infinite Scroll Container - Mobile-first */}
          <div 
            className="categories-scroll-container overflow-x-auto scrollbar-hide scroll-smooth"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex gap-3 sm:gap-4 md:gap-6 lg:gap-8 pb-4 sm:pb-6 min-w-max px-4 sm:px-6">
              {infiniteCategories.map((category, index) => (
                <div
                  key={`${category._id}-${index}`}
                  className="group cursor-pointer bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100 hover:border-purple-200 min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] flex-shrink-0"
                >
                  {/* Icon Container - Mobile-first */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-purple-100 to-red-100 flex items-center justify-center group-hover:from-purple-200 group-hover:to-red-200 transition-all duration-300 shadow-sm group-hover:shadow-md">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={72}
                        height={72}
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-cover rounded-full"
                      />
                    ) : (
                      <SafeIcons.ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-purple-600" />
                    )}
                  </div>
                  
                  {/* Category Name - Mobile-first */}
                  <h3 className="text-center font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-300 text-sm sm:text-base md:text-lg lg:text-xl leading-tight mb-2">
                    {category.name}
                  </h3>
                  
                  {/* Product Count - Mobile-first */}
                  <p className="text-center text-sm text-gray-500 mt-2 font-medium">
                    {category.productCount || 0} sản phẩm
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CategoriesShowcase.displayName = 'CategoriesShowcase';

// Brand Showcase Component - Mobile-first Responsive
const BrandShowcase = memo(() => {
  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 xl:py-6">
        {/* Header Section - Mobile-first */}
        <div className="text-center mb-2 sm:mb-3 lg:mb-4 xl:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 leading-tight">
            Thương Hiệu Đối Tác
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-sm sm:max-w-md md:max-w-lg mx-auto">
            Các thương hiệu thể thao hàng đầu thế giới
          </p>
        </div>
        
        {/* Brand Container - Mobile-first */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-gray-100 hover:border-gray-200">
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-400 tracking-widest select-none">
              Coming soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

BrandShowcase.displayName = 'BrandShowcase';

// Social Proof Component - Mobile-first Responsive
const SocialProof = memo(() => (
  <div className="w-full bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 sm:pt-2 lg:pt-3 xl:pt-4 pb-2 sm:pb-3 lg:pb-4 xl:pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-center">
        {/* Khách hàng hài lòng */}
        <div className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-white to-purple-50/30 rounded-xl sm:rounded-2xl border border-purple-100/50 hover:border-purple-200 transition-all duration-300">
          <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3">
            <span className="inline-flex items-center justify-center">
              <NumberTicker 
                value={50000} 
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-purple-600 mb-1 sm:mb-2" 
              />
              <span className="ml-1 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-600">+</span>
            </span>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Khách hàng hài lòng</div>
          </div>
        </div>

        {/* Sản phẩm đa dạng */}
        <div className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-white to-red-50/30 rounded-xl sm:rounded-2xl border border-red-100/50 hover:border-red-200 transition-all duration-300">
          <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3">
            <span className="inline-flex items-center justify-center">
              <NumberTicker 
                value={1000} 
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-red-600 mb-1 sm:mb-2" 
              />
              <span className="ml-1 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-red-600">+</span>
            </span>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Sản phẩm đa dạng</div>
          </div>
        </div>

        {/* Đánh giá trung bình */}
        <div className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-white to-yellow-50/30 rounded-xl sm:rounded-2xl border border-yellow-100/50 hover:border-yellow-200 transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3">
            <span className="inline-flex items-center justify-center">
              <NumberTicker 
                value={4.8} 
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-600 mb-1 sm:mb-2" 
              />
              <span className="ml-1 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-yellow-600 relative -top-0.5 sm:-top-1">★</span>
            </span>
            <div className="text-sm sm:text-base text-gray-600 font-medium">Đánh giá trung bình</div>
          </div>
        </div>
      </div>
    </div>
  </div>
));

SocialProof.displayName = 'SocialProof';

// Tách component Hero Banner riêng để tối ưu
const HeroBanner = memo(() => (
  <div className="w-full bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 lg:mt-8">
      <div className="relative rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-500">
        {/* Background Image with Zoom Effect - Mobile-first */}
        <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] transform transition-transform duration-700 group-hover:scale-105">
          <Image
            src="/Ronaldo.png"
            alt="Ronaldo promotion"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1280px"
            className="object-cover object-center brightness-[1.02]"
            priority
          />
        </div>

        {/* Gradient Overlay - Mobile-first */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        
        {/* Decorative Elements - Mobile-first */}
        <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 bg-gradient-to-r from-purple-500/20 to-red-500/20 rounded-br-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 bg-gradient-to-l from-purple-500/20 to-red-500/20 rounded-tl-full blur-2xl"></div>

        {/* Content Container - Mobile-first */}
        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {/* Sale Badge - Mobile-first */}
          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs sm:text-sm md:text-base font-semibold px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full w-fit mb-3 sm:mb-4 md:mb-6
            shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:-translate-y-0.5">
            KHUYẾN MÃI ĐẶC BIỆT
          </span>

          {/* Main Title - Mobile-first */}
          <h1 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">
            Giảm Giá Lên Đến
            <span> </span>
            <span className="relative inline-block">
              <AnimatedNumberTicker />
            </span>
          </h1>

          {/* Description - Mobile-first */}
          <p className="text-white/90 font-medium max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mb-4 sm:mb-6 md:mb-8 leading-relaxed text-xs sm:text-sm md:text-base lg:text-lg">
            Đăng ký thành viên để nhận ưu đãi đặc biệt từ{' '}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
              VJU SPORT
            </span>{' '}
            và cập nhật sản phẩm mới nhất.
          </p>

          {/* CTA Button - Mobile-first */}
          <button className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 
            text-white px-4 sm:px-5 md:px-6 lg:px-8 py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-lg font-bold w-fit flex items-center shadow-lg hover:shadow-purple-500/25 
            transition-all duration-300 hover:-translate-y-0.5 text-sm sm:text-base md:text-lg">
            <span className="relative z-10">Tham Gia Ngay</span>
            <SafeIcons.ArrowRight size={16} className="ml-2 relative z-10 transform group-hover:translate-x-1 transition-transform duration-300" />
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white/10 to-transparent transform -skew-x-12 
              transition-transform duration-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-[200%]"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
));

HeroBanner.displayName = 'HeroBanner';

function AnimatedNumberTicker() {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setTimeout(() => setValue(50), 300);
  }, []);
  return (
    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
      <NumberTicker value={value} className="inline" />%
    </span>
  );
}

// Product Section Component - Mobile-first Responsive
const ProductSection = memo(({ products, categories }: { products: UserProduct[]; categories: Category[] }) => {
  const productsByCategory = useMemo(() => {
    return categories.map(category => {
      const productsInCategory = products.filter(
        (product) => product.categoryId === category._id || product.categoryId === category.categoryId
      );
      return { category, products: productsInCategory };
    }).filter(item => item.products.length > 0);
  }, [products, categories]);

  if (!productsByCategory.length) {
    return <p className="text-center text-gray-500 px-4 text-sm sm:text-base">Không có sản phẩm nào</p>;
  }

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 xl:py-6">
        {/* Main Title - Mobile-first */}
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4 xl:mb-6 leading-tight">
          Sản phẩm Mới
        </h1>
        
        {productsByCategory.map(({ category, products }) => (
          <div key={category._id} className="mb-8 sm:mb-10 lg:mb-12 xl:mb-16">
            {/* Category Header - Mobile-first */}
            <div className="flex items-center mb-4 sm:mb-6 lg:mb-8">
              {category.image && (
                <Image
                  src={category.image}
                  alt={category.name}
                  width={40}
                  height={40}
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full object-cover mr-3 sm:mr-4 border shadow-sm"
                />
              )}
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 leading-tight">
                {category.name}
              </h2>
            </div>
            
            {/* Products Grid - Mobile-first */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ProductSection.displayName = 'ProductSection';

// Testimonials Section Component - Mobile-first Responsive
const TestimonialsSection = memo(() => (
  <div className="relative py-2 sm:py-3 lg:py-4 xl:py-6 overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
    {/* Background với gradient và pattern */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-white to-red-100/30"></div>
    
    {/* Decorative Elements - Mobile-first */}
    <div className="absolute top-0 left-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 bg-purple-200/30 rounded-full mix-blend-multiply blur-3xl animate-blob"></div>
    <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 bg-red-200/30 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-2000"></div>
    <div className="absolute -bottom-8 left-20 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 bg-pink-200/30 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-4000"></div>
    
    <div className="w-full">
      <div className="max-w-8xl xl:max-w-9xl 2xl:max-w-full 2xl:mx-8 mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header - Mobile-first */}
        <div className="text-center mb-2 sm:mb-3 lg:mb-4 xl:mb-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-1 sm:w-16 sm:h-1.5 md:w-20 md:h-2 lg:w-24 lg:h-2 bg-gradient-to-r from-purple-500 to-red-500 rounded-full mb-3 sm:mb-4 md:mb-6 lg:mb-8"></div>
            <span className="text-purple-600 font-semibold tracking-wider mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">KHÁCH HÀNG NÓI GÌ</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
              ĐÁNH GIÁ TỪ KHÁCH HÀNG
            </h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 xl:gap-8 relative">
          {/* Background Elements - Mobile-first */}
          <div className="absolute top-1/2 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-gradient-to-r from-purple-200/30 to-transparent rounded-full opacity-60 blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-60 md:h-60 lg:w-80 lg:h-80 bg-gradient-to-l from-red-200/30 to-transparent rounded-full opacity-60 blur-2xl"></div>

          {/* Testimonial Cards - Mobile-first */}
          {/* Card 1 */}
          <div className="group bg-gradient-to-br from-white to-purple-50/50 backdrop-blur-sm p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 rounded-lg sm:rounded-xl md:rounded-2xl border border-purple-100 hover:border-purple-300 transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex items-center mb-2 sm:mb-3 md:mb-4 lg:mb-6 relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 ring-2 ring-purple-200 group-hover:ring-purple-400">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Liu-bang.jpg"
                  alt="Hán Cao Tổ"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4">
                <h4 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300 text-xs sm:text-sm md:text-base lg:text-lg leading-tight">Nguyễn Minh Khôi</h4>
                <p className="text-xs sm:text-sm text-gray-500">Huấn luyện viên thể hình</p>
              </div>
              {/* Quote Icon - Mobile-first */}
              <div className="absolute top-0 right-0 text-gray-200 transform -translate-y-1/2 group-hover:text-purple-300 transition-colors duration-300">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-12 lg:h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-2 sm:mb-3 md:mb-4 lg:mb-6 relative z-10 group-hover:text-gray-800 transition-colors duration-300 text-xs sm:text-sm md:text-base lg:text-lg">
              &ldquo;Sản phẩm chất lượng cực tốt, mặc thoáng và thoải mái khi tập luyện. Giao hàng nhanh, đóng gói đẹp, chắc chắn tôi sẽ quay lại mua nhiều lần nữa!&rdquo;
            </p>

            <div className="flex items-center justify-between">
              <div className="flex text-yellow-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs sm:text-sm text-gray-500 italic">2025</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-gradient-to-br from-white to-red-50/50 backdrop-blur-sm p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 rounded-lg sm:rounded-xl md:rounded-2xl border border-red-100 hover:border-red-300 transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-r from-red-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex items-center mb-2 sm:mb-3 md:mb-4 lg:mb-6 relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 ring-2 ring-red-200 group-hover:ring-red-400">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Song_Taizu.jpg/1200px-Song_Taizu.jpg"
                  alt="Tống Thái Tổ"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4">
                <h4 className="font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-300 text-xs sm:text-sm md:text-base lg:text-lg leading-tight">Trần Bích Ngọc</h4>
                <p className="text-xs sm:text-sm text-gray-500">Doanh nhân & runner bán chuyên</p>
              </div>
              <div className="absolute top-0 right-0 text-gray-200 transform -translate-y-1/2 group-hover:text-red-300 transition-colors duration-300">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-12 lg:h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-2 sm:mb-3 md:mb-4 lg:mb-6 relative z-10 group-hover:text-gray-800 transition-colors duration-300 text-xs sm:text-sm md:text-base lg:text-lg">
              &ldquo;Thiết kế năng động, rất hợp xu hướng. Đặc biệt mình ấn tượng với chính sách đổi trả và hỗ trợ khách hàng cực kỳ chuyên nghiệp.&rdquo;
            </p>

            <div className="flex items-center justify-between">
              <div className="flex text-yellow-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs sm:text-sm text-gray-500 italic">2025</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-gradient-to-br from-white to-pink-50/50 backdrop-blur-sm p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 rounded-lg sm:rounded-xl md:rounded-2xl border border-pink-100 hover:border-pink-300 transition-all duration-500 relative overflow-hidden sm:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex items-center mb-2 sm:mb-3 md:mb-4 lg:mb-6 relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 ring-2 ring-pink-200 group-hover:ring-pink-400">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/%E6%98%8E%E5%A4%AA%E7%A5%96%E7%94%BB%E5%83%8F.jpg/250px-%E6%98%8E%E5%A4%AA%E7%A5%96%E7%94%BB%E5%83%8F.jpg"
                  alt="Minh Thái Tổ"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4">
                <h4 className="font-bold text-gray-800 group-hover:text-pink-600 transition-colors duration-300 text-xs sm:text-sm md:text-base lg:text-lg leading-tight">Lê Hoàng Anh</h4>
                <p className="text-xs sm:text-sm text-gray-500">Nhà sáng tạo nội dung (Fitness Creator)</p>
              </div>
              <div className="absolute top-0 right-0 text-gray-200 transform -translate-y-1/2 group-hover:text-pink-300 transition-colors duration-300">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-12 lg:h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-2 sm:mb-3 md:mb-4 lg:mb-6 relative z-10 group-hover:text-gray-800 transition-colors duration-300 text-xs sm:text-sm md:text-base lg:text-lg">
              &ldquo;Mình đã thử nhiều thương hiệu, nhưng ở đây chất liệu và form áo rất hoàn hảo. Rất phù hợp để quay video tập luyện mà vẫn đẹp và tự tin!&rdquo;
            </p>

            <div className="flex items-center justify-between">
              <div className="flex text-yellow-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 transform group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs sm:text-sm text-gray-500 italic">2025</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Pattern Overlay */}
    <div className="absolute inset-0 opacity-5" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: '20px 20px'
    }}></div>
  </div>
));

TestimonialsSection.displayName = 'TestimonialsSection';

// Featured Product Section Component - Mobile-first Responsive
const FeaturedProductSection = memo(() => (
  <div className="w-full bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 xl:py-6">
      {/* Header Section - Mobile-first */}
      <div className="text-center mb-2 sm:mb-3 lg:mb-4 xl:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 leading-tight">
          Sản Phẩm Nổi Bật
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto px-4 leading-relaxed">
          Khám phá sản phẩm đặc biệt với ưu đãi có thời hạn. Đừng bỏ lỡ cơ hội sở hữu những sản phẩm chất lượng cao với giá tốt nhất!
        </p>
      </div>
      
      {/* Carousel Container - Mobile-first */}
      <Suspense fallback={<Skeleton className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] w-full rounded-lg sm:rounded-xl md:rounded-2xl" />}>
        <FeaturedProductsCarousel />
      </Suspense>
    </div>
  </div>
));

FeaturedProductSection.displayName = 'FeaturedProductSection';

// Main HomePage Component - Responsive
const HomePage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, checkAuthStatus } = useAuth();

  // Tối ưu auth check với useCallback
  const handleAuthCheck = useCallback(() => {
    if (user === null && typeof window !== 'undefined' && !(window as Window & { __checkedAuth?: boolean }).__checkedAuth) {
      (window as Window & { __checkedAuth?: boolean }).__checkedAuth = true;
      checkAuthStatus();
    }
  }, [user, checkAuthStatus]);

  useEffect(() => {
    handleAuthCheck();
  }, [handleAuthCheck]);

  // Tối ưu redirect logic với useCallback
  const handleRedirect = useCallback(() => {
    console.log('👤 User page - User state:', {
      hasUser: !!user,
      userRole: user?.role,
      currentPath: typeof window !== 'undefined' ? window.location.pathname : 'unknown'
    });
    
    if (
      user &&
      user.role === "admin" &&
      typeof window !== "undefined" &&
      window.location.pathname === "/user"
    ) {
      console.log('🔄 User page - Admin user detected, redirecting to admin dashboard');
      router.replace("/admin/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  // Tối ưu data fetching với useCallback
  const fetchData = useCallback(async () => {
    try {
      console.log('🔄 Fetching data...');
      const [productRes, categoryRes] = await Promise.all([
        userProductService.getProducts(),
        categoryService.getCategories(),
      ]) as [ApiResponse<UserProductsResponse>, ApiResponse<CategoriesResponse>];
      
      console.log('📦 Product response:', productRes);
      console.log('📂 Category response:', categoryRes);
      
      if (!productRes.success) throw new Error("Lỗi khi lấy dữ liệu sản phẩm");
      if (!categoryRes.success) throw new Error("Lỗi khi lấy dữ liệu thể loại");
      
      setProducts(productRes.data.products);
      setCategories(categoryRes.data.categories || []);
      console.log('✅ Data loaded successfully');
      console.log('📊 Categories loaded:', {
        count: categoryRes.data.categories?.length || 0,
        categories: categoryRes.data.categories?.map((c: Category) => c.name)
      });
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setError("Đã xảy ra lỗi khi tải dữ liệu");
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Loading state - Mobile-first Responsive
  if (loading) return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 lg:mt-8">
          <div className="grid grid-cols-12 gap-4 sm:gap-6 items-stretch">
            <div className="col-span-12 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden group shadow-lg h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px]">
              <Skeleton className="w-full h-full rounded-lg sm:rounded-xl lg:rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full rounded-lg sm:rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return <p className="text-center text-red-500 px-4">{error}</p>;

  return (
    <div className="min-h-screen bg-white">
      <HeroBanner />
      <CategoriesShowcase categories={categories} />
      <FeaturedProductSection />
      <ProductSection products={products} categories={categories} />
      <SocialProof />
      <BrandShowcase />
      <TestimonialsSection />
    </div>
  );
};

export default memo(HomePage); 