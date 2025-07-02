"use client";

import React, { useMemo, useCallback, memo } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";

// Tách component Countdown Timer riêng để tối ưu re-render - Mobile-first
const CountdownTimer = memo(({ timeLeft }: { timeLeft: { days: number; hours: number; minutes: number; seconds: number } }) => (
  <div className="flex gap-1 sm:gap-1.5 md:gap-2">
    {[
      { value: timeLeft.days, label: 'D' },
      { value: timeLeft.hours, label: 'H' },
      { value: timeLeft.minutes, label: 'M' },
      { value: timeLeft.seconds.toString().padStart(2, '0'), label: 'S' }
    ].map((item, index) => (
      <div key={index} className="bg-gray-100 rounded-md p-1 sm:p-1.5 md:p-2 text-center min-w-[28px] sm:min-w-[32px] md:min-w-[35px] lg:min-w-[40px] transition-all duration-300 hover:bg-gray-200">
        <div className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900">{item.value}</div>
        <div className="text-xs sm:text-sm text-gray-600">{item.label}</div>
      </div>
    ))}
  </div>
));

CountdownTimer.displayName = 'CountdownTimer';

// Tách component Rating Stars riêng - Mobile-first
const RatingStars = memo(({ rating }: { rating: number }) => (
  <div className="flex items-center mb-2 sm:mb-2.5 md:mb-3">
    {Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 transition-colors duration-200 ${
          index < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ))}
  </div>
));

RatingStars.displayName = 'RatingStars';

// Tách component Progress Bar riêng - Mobile-first
const ProgressBar = memo(({ sold, total }: { sold: number; total: number }) => {
  const percentage = useMemo(() => (sold / total) * 100, [sold, total]);
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 md:h-2.5 lg:h-3 mb-2 sm:mb-3 md:mb-4 overflow-hidden">
      <div 
        className="bg-gradient-to-r from-pink-400 to-pink-500 h-1.5 sm:h-2 md:h-2.5 lg:h-3 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

interface ProductCardWithTimerProps {
  product?: {
    name?: string;
    price?: number;
    originalPrice?: number;
    sold?: number;
    total?: number;
    rating?: number;
  };
  isCompact?: boolean;
}

const ProductCardWithTimer = ({ 
  product = {
    name: "SHAMPOO, CONDITIONER & FACEWASH PACKS",
    price: 100000,
    originalPrice: 2000000,
    sold: 20,
    total: 60,
    rating: 3
  },
  isCompact = false
}: ProductCardWithTimerProps) => {
  // Sử dụng custom hook cho countdown
  const { timeLeft, isComplete } = useCountdown({
    initialDays: 360,
    initialHours: 24,
    initialMinutes: 59,
    initialSeconds: 0,
    onComplete: () => {
      console.log('Countdown completed!');
    }
  });

  // Tối ưu với useMemo cho các giá trị tính toán
  const discountAmount = useMemo(() => (product.originalPrice || 2000000) - (product.price || 100000), [product.originalPrice, product.price]);
  const discountPercentage = useMemo(() => Math.round((discountAmount / (product.originalPrice || 2000000)) * 100), [discountAmount, product.originalPrice]);

  // Tối ưu event handler
  const handleAddToCart = useCallback(() => {
    // TODO: Implement add to cart logic
    console.log('Adding to cart...');
  }, []);

  if (isCompact) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-105 min-w-[240px] sm:min-w-[280px] md:min-w-[320px] lg:min-w-[360px]">
        {/* Product Image - Mobile-first */}
        <div className="relative h-36 sm:h-40 md:h-48 lg:h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Image 
            src="/default-image.png" 
            alt={product.name || "Product Pack"}
            width={200}
            height={200}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>

        {/* Product Details - Mobile-first */}
        <div className="p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4">
          {/* Rating */}
          <RatingStars rating={product.rating || 3} />

          {/* Product Title */}
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 leading-tight line-clamp-2">
            {product.name}
          </h3>

          {/* Price with discount badge - Mobile-first */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-pink-500">
              {(product.price || 100000).toLocaleString('vi-VN')}đ
            </span>
            <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 line-through">
              {(product.originalPrice || 2000000).toLocaleString('vi-VN')}đ
            </span>
            <span className="bg-red-100 text-red-600 text-xs sm:text-sm font-semibold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full">
              -{discountPercentage}%
            </span>
          </div>

          {/* Add to Cart Button - Mobile-first */}
          <button 
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-black hover:to-gray-800 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base md:text-lg"
          >
            Thêm Vào Giỏ
          </button>

          {/* Stock Information - Mobile-first */}
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-gray-600">
              Đã bán: <span className="font-semibold text-gray-900">{product.sold || 20}</span>
            </span>
            <span className="text-gray-600">
              Còn lại: <span className="font-semibold text-gray-900">{(product.total || 60) - (product.sold || 20)}</span>
            </span>
          </div>

          {/* Progress Bar */}
          <ProgressBar sold={product.sold || 20} total={product.total || 60} />

          {/* Countdown Timer - Mobile-first */}
          <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">
              ⏰ Nhanh tay! Ưu đãi kết thúc sau:
            </p>
            {isComplete ? (
              <div className="text-red-500 font-bold text-sm sm:text-base md:text-lg">OFFER EXPIRED!</div>
            ) : (
              <CountdownTimer timeLeft={timeLeft} />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Original large layout - Mobile-first
  return (
    <div className="w-full max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col lg:flex-row">
        {/* Product Image - Mobile-first */}
        <div className="w-full lg:w-1/2 p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg group aspect-[4/3] overflow-hidden" style={{height: '160px', minHeight: '160px'}}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Image 
              src="/default-image.png" 
              alt="Product Pack"
              width={240}
              height={180}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
        </div>

        {/* Product Details - Mobile-first */}
        <div className="w-full lg:w-1/2 p-3 sm:p-4 lg:p-6 flex flex-col justify-center space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4">
          {/* Rating */}
          <RatingStars rating={3} />

          {/* Product Title - Mobile-first */}
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 leading-tight">
            SHAMPOO, CONDITIONER & FACEWASH PACKS
          </h1>

          {/* Description - Mobile-first */}
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed line-clamp-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptates, quod, quia, voluptate quae voluptatem quibusdam voluptatibus quos quas nesciunt.
          </p>

          {/* Price with discount badge - Mobile-first */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-pink-500">100.000đ</span>
            <span className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 line-through">2.000.000đ</span>
            <span className="bg-red-100 text-red-600 text-xs sm:text-sm md:text-base font-semibold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full">
              -{discountPercentage}%
            </span>
          </div>

          {/* Add to Cart Button - Mobile-first */}
          <button 
            onClick={handleAddToCart}
            className="w-fit bg-gradient-to-r from-red-500 to-pink-500 hover:from-black hover:to-gray-800 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base md:text-lg"
          >
            Thêm Vào Giỏ
          </button>

          {/* Stock Information - Mobile-first */}
          <div className="flex justify-between items-center text-sm sm:text-base">
            <span className="text-gray-600">
              Đã bán: <span className="font-semibold text-gray-900">20</span>
            </span>
            <span className="text-gray-600">
              Còn lại: <span className="font-semibold text-gray-900">40</span>
            </span>
          </div>

          {/* Progress Bar */}
          <ProgressBar sold={20} total={60} />

          {/* Countdown Timer - Mobile-first */}
          <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
            <p className="text-sm sm:text-base font-semibold text-gray-700">
              ⏰ Nhanh tay! Ưu đãi kết thúc sau:
            </p>
            {isComplete ? (
              <div className="text-red-500 font-bold text-sm sm:text-base md:text-lg">OFFER EXPIRED!</div>
            ) : (
              <CountdownTimer timeLeft={timeLeft} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCardWithTimer); 