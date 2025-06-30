"use client";

import React, { useMemo, useCallback, memo } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";

// Tách component Countdown Timer riêng để tối ưu re-render
const CountdownTimer = memo(({ timeLeft }: { timeLeft: { days: number; hours: number; minutes: number; seconds: number } }) => (
  <div className="flex gap-1 sm:gap-2">
    {[
      { value: timeLeft.days, label: 'D' },
      { value: timeLeft.hours, label: 'H' },
      { value: timeLeft.minutes, label: 'M' },
      { value: timeLeft.seconds.toString().padStart(2, '0'), label: 'S' }
    ].map((item, index) => (
      <div key={index} className="bg-gray-100 rounded-md p-1 sm:p-2 text-center min-w-[30px] sm:min-w-[35px] transition-all duration-300 hover:bg-gray-200">
        <div className="text-sm sm:text-base font-bold text-gray-900">{item.value}</div>
        <div className="text-xs text-gray-600">{item.label}</div>
      </div>
    ))}
  </div>
));

CountdownTimer.displayName = 'CountdownTimer';

// Tách component Rating Stars riêng
const RatingStars = memo(({ rating }: { rating: number }) => (
  <div className="flex items-center mb-2 sm:mb-3">
    {Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-200 ${
          index < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ))}
  </div>
));

RatingStars.displayName = 'RatingStars';

// Tách component Progress Bar riêng
const ProgressBar = memo(({ sold, total }: { sold: number; total: number }) => {
  const percentage = useMemo(() => (sold / total) * 100, [sold, total]);
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mb-3 sm:mb-4 overflow-hidden">
      <div 
        className="bg-gradient-to-r from-pink-400 to-pink-500 h-1.5 sm:h-2 rounded-full transition-all duration-500 ease-out"
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
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-105 min-w-[280px] sm:min-w-[320px]">
        {/* Product Image */}
        <div className="relative h-48 sm:h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group">
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

        {/* Product Details */}
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          {/* Rating */}
          <RatingStars rating={product.rating || 3} />

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight line-clamp-2">
            {product.name}
          </h3>

          {/* Price with discount badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg sm:text-xl font-bold text-pink-500">
              {(product.price || 100000).toLocaleString('vi-VN')}đ
            </span>
            <span className="text-sm sm:text-base text-gray-400 line-through">
              {(product.originalPrice || 2000000).toLocaleString('vi-VN')}đ
            </span>
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
              -{discountPercentage}%
            </span>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-black hover:to-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm"
          >
            ADD TO CART
          </button>

          {/* Stock Information */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">
              Đã bán: <span className="font-semibold text-gray-900">{product.sold || 20}</span>
            </span>
            <span className="text-gray-600">
              Còn lại: <span className="font-semibold text-gray-900">{(product.total || 60) - (product.sold || 20)}</span>
            </span>
          </div>

          {/* Progress Bar */}
          <ProgressBar sold={product.sold || 20} total={product.total || 60} />

          {/* Countdown Timer */}
          <div className="space-y-1 sm:space-y-2">
            <p className="text-xs font-semibold text-gray-700">
              ⏰ Nhanh tay! Ưu đãi kết thúc sau:
            </p>
            {isComplete ? (
              <div className="text-red-500 font-bold text-sm">OFFER EXPIRED!</div>
            ) : (
              <CountdownTimer timeLeft={timeLeft} />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Original large layout
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col lg:flex-row">
        {/* Product Image - Responsive với height ngắn hơn */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="relative w-full max-w-md lg:max-w-lg group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Image 
              src="/default-image.png" 
              alt="Product Pack"
              width={400}
              height={400}
              className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
        </div>

        {/* Product Details - Responsive với spacing tối ưu */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Rating */}
          <RatingStars rating={3} />

          {/* Product Title */}
          <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 leading-tight">
            SHAMPOO, CONDITIONER & FACEWASH PACKS
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptates, quod, quia, voluptate quae voluptatem quibusdam voluptatibus quos quas nesciunt.
          </p>

          {/* Price with discount badge */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-2xl sm:text-3xl font-bold text-pink-500">100.000đ</span>
            <span className="text-lg sm:text-xl text-gray-400 line-through">2.000.000đ</span>
            <span className="bg-red-100 text-red-600 text-xs sm:text-sm font-semibold px-2 py-1 rounded-full">
              -{discountPercentage}%
            </span>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            className="w-fit bg-gradient-to-r from-red-500 to-pink-500 hover:from-black hover:to-gray-800 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base"
          >
            ADD TO CART
          </button>

          {/* Stock Information */}
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-gray-600">
              Đã bán: <span className="font-semibold text-gray-900">20</span>
            </span>
            <span className="text-gray-600">
              Còn lại: <span className="font-semibold text-gray-900">40</span>
            </span>
          </div>

          {/* Progress Bar */}
          <ProgressBar sold={20} total={60} />

          {/* Countdown Timer */}
          <div className="space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">
              ⏰ Nhanh tay! Ưu đãi kết thúc sau:
            </p>
            {isComplete ? (
              <div className="text-red-500 font-bold text-base sm:text-lg">OFFER EXPIRED!</div>
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