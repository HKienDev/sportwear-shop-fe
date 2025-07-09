"use client";

import React, { useMemo, useCallback, memo } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { useCartOptimized } from "@/hooks/useCartOptimized";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

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
    image?: string;
    sku?: string;
    brand?: string;
    category?: string;
    description?: string;
    featuredConfig?: {
      countdownEndDate?: string;
      soldCount?: number;
      remainingStock?: number;
      isActive?: boolean;
    } | null;
    colors?: string[];
    sizes?: string[];
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
    rating: 3,
    image: "/default-image.png",
    sku: "DEFAULT-SKU",
    brand: "Default Brand",
    category: "Default Category"
  },
  isCompact = false
}: ProductCardWithTimerProps) => {
  const { addToCart, fetchCart } = useCartOptimized();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Tính toán countdown từ featuredConfig hoặc sử dụng giá trị mặc định
  const countdownConfig = useMemo(() => {
    if (product.featuredConfig?.countdownEndDate && product.featuredConfig.isActive) {
      const endDate = new Date(product.featuredConfig.countdownEndDate);
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        return {
          days,
          hours,
          minutes,
          seconds,
          isComplete: false
        };
      } else {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true
        };
      }
    }
    
    // Fallback to default countdown
    return {
      days: 360,
      hours: 24,
      minutes: 59,
      seconds: 0,
      isComplete: false
    };
  }, [product.featuredConfig]);

  // Sử dụng custom hook cho countdown với config động
  const { timeLeft, isComplete } = useCountdown({
    initialDays: countdownConfig.days,
    initialHours: countdownConfig.hours,
    initialMinutes: countdownConfig.minutes,
    initialSeconds: countdownConfig.seconds,
    onComplete: () => {
      console.log('Countdown completed!');
    }
  });

  // Tối ưu với useMemo cho các giá trị tính toán
  const discountAmount = useMemo(() => (product.originalPrice || 2000000) - (product.price || 100000), [product.originalPrice, product.price]);
  const discountPercentage = useMemo(() => Math.round((discountAmount / (product.originalPrice || 2000000)) * 100), [discountAmount, product.originalPrice]);

  // Tối ưu event handler với logic thực sự
  const handleAddToCart = useCallback(async () => {
    console.log('🔍 handleAddToCart called');
    console.log('🔍 isAuthenticated:', isAuthenticated);
    console.log('🔍 product:', product);

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      router.push('/auth/login');
      return;
    }

    // Kiểm tra xem sản phẩm có hết hạn ưu đãi không
    if (isComplete) {
      toast.error("Ưu đãi đã hết hạn!");
      return;
    }

    if (!product.sku) {
      toast.error("Không tìm thấy thông tin sản phẩm");
      return;
    }

    try {
      // Lấy thông tin sản phẩm đầy đủ từ backend trực tiếp
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      
      // Thử endpoint khác nhau
      let productResponse;
      let fullProduct = null;

      // Thử endpoint 1: /api/products/sku/:sku
      try {
        productResponse = await fetch(`${API_URL}/api/products/sku/${product.sku}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Product API response status:', productResponse.status);
        
        if (productResponse.ok) {
          const productData = await productResponse.json();
          fullProduct = productData.data;
          console.log('Full product data:', fullProduct);
        }
      } catch (error) {
        console.log('Endpoint 1 failed:', error);
      }

      // Thử endpoint 2: /api/products?keyword=${sku}&limit=1
      if (!fullProduct) {
        try {
          productResponse = await fetch(`${API_URL}/api/products?keyword=${product.sku}&limit=1`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log('Product API response status (endpoint 2):', productResponse.status);
          
          if (productResponse.ok) {
            const productData = await productResponse.json();
            if (productData.data && productData.data.length > 0) {
              fullProduct = productData.data[0];
              console.log('Full product data (endpoint 2):', fullProduct);
            }
          }
        } catch (error) {
          console.log('Endpoint 2 failed:', error);
        }
      }

      // Fallback: Sử dụng dữ liệu từ props
      if (!fullProduct) {
        console.log('Using fallback data from props');
        fullProduct = product;
      }

      console.log('🔍 fullProduct data:', fullProduct);
      console.log('🔍 fullProduct.colors:', fullProduct.colors);
      console.log('🔍 fullProduct.sizes:', fullProduct.sizes);

      // Lấy color và size thực tế từ sản phẩm
      let color = undefined;
      let size = undefined;

      console.log('🔍 === NEW LOGIC START ===');
      console.log('🔍 fullProduct data:', fullProduct);
      console.log('🔍 fullProduct.colors:', fullProduct.colors);
      console.log('🔍 fullProduct.sizes:', fullProduct.sizes);

      // Nếu sản phẩm có colors, lấy color đầu tiên
      if (fullProduct.colors && Array.isArray(fullProduct.colors) && fullProduct.colors.length > 0) {
        color = fullProduct.colors[0];
        console.log('🔍 Found color from product:', color);
      } else {
        console.log('🔍 No colors found in product');
      }

      // Nếu sản phẩm có sizes, lấy size đầu tiên
      if (fullProduct.sizes && Array.isArray(fullProduct.sizes) && fullProduct.sizes.length > 0) {
        // Nếu sizes là array of objects, lấy size từ object đầu tiên
        if (typeof fullProduct.sizes[0] === 'object' && fullProduct.sizes[0].size) {
          size = fullProduct.sizes[0].size;
          console.log('🔍 Found size from product (object):', size);
        } else {
          // Nếu sizes là array of strings
          size = fullProduct.sizes[0];
          console.log('🔍 Found size from product (string):', size);
        }
      } else {
        console.log('🔍 No sizes found in product');
      }

      console.log('🔍 === NEW LOGIC END ===');
      console.log('Selected color:', color);
      console.log('Selected size:', size);

      // Gọi API addToCart với format đúng
      const cartData: { sku: string; quantity: number; color?: string; size?: string } = {
        sku: product.sku,
        quantity: 1
      };

      // Chỉ thêm color và size nếu có
      if (color) {
        cartData.color = color;
      }
      if (size) {
        cartData.size = size;
      }

      console.log('Cart data to send:', cartData);

      await addToCart(cartData);
      
      console.log('🔍 addToCart completed');
      
      // addToCart hook tự động hiển thị toast và xử lý lỗi
      // Chỉ cần refresh cart data
      fetchCart();
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  }, [isAuthenticated, product, addToCart, fetchCart, router, isComplete]);

  if (isCompact) {
    return (
      <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 min-w-[240px] sm:min-w-[280px] md:min-w-[320px] lg:min-w-[360px]">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Product Image - Ultra Enhanced */}
        <div className="relative h-44 sm:h-48 md:h-52 lg:h-56 bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center group/image overflow-hidden rounded-t-2xl">
          {/* 3D Parallax Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-pink-100/20 to-blue-100/30 opacity-0 group-hover/image:opacity-100 transition-opacity duration-700"></div>
          
          {/* Animated Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/image:translate-x-full transition-transform duration-1500 ease-out"></div>
          
          {/* Multi-layer Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover/image:opacity-100 transition-opacity duration-700"></div>
          
          {/* Main Image Container with 3D Effect */}
                      <div className="relative w-full h-full flex items-center justify-center transform perspective-1000">
              <div className="relative w-full h-full transform transition-all duration-700 group-hover/image:scale-110 group-hover/image:rotate-y-12 group-hover/image:rotate-x-6">
                <Image 
                  src={product.image || "/default-image.png"} 
                  alt={product.name || "Product Pack"}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover transition-all duration-700 group-hover/image:scale-105 group-hover/image:rotate-2 drop-shadow-2xl"
                  priority
                />
              
              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-ping shadow-lg"></div>
            </div>
          </div>
          
          {/* Enhanced Floating Discount Badge */}
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl transform rotate-12 hover:rotate-0 transition-all duration-300 hover:scale-110 hover:shadow-2xl border border-white/20">
            <span className="relative z-10">-{discountPercentage}%</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500 rounded-full"></div>
          </div>
          
          {/* Corner Accent */}
          <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-br-2xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
          
          {/* Bottom Glow */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Product Details - Enhanced */}
        <div className="relative p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
          {/* Rating with enhanced styling */}
          <div className="flex items-center justify-between">
            <RatingStars rating={product.rating || 3} />
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span>🔥</span>
              <span className="font-medium">Hot</span>
            </div>
          </div>

          {/* Product Title - Enhanced */}
          <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-gray-800 transition-colors duration-300">
            {product.name}
          </h3>

          {/* Price with enhanced styling */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              {(product.price || 100000).toLocaleString('vi-VN')}đ
            </span>
            <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 line-through">
              {(product.originalPrice || 2000000).toLocaleString('vi-VN')}đ
            </span>
          </div>

          {/* Enhanced Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={isComplete}
            className={`w-full font-bold py-3 sm:py-4 px-4 sm:px-5 rounded-xl transition-all duration-300 transform text-sm sm:text-base md:text-lg relative overflow-hidden ${
              isComplete 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-inner' 
                : 'bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95'
            }`}
          >
            {/* Button shine effect */}
            {!isComplete && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {!isComplete && <span>🛒</span>}
              {isComplete ? '⏰ HẾT HẠN ƯU ĐÃI!' : 'Thêm Vào Giỏ'}
            </span>
          </button>

          {/* Enhanced Stock Information */}
          <div className="flex justify-between items-center text-xs sm:text-sm bg-gray-50/50 rounded-lg p-2 sm:p-3">
            <span className="text-gray-600 flex items-center gap-1">
              <span>📦</span>
              Đã bán: <span className="font-bold text-gray-900">
                {product.featuredConfig?.soldCount ?? product.sold ?? 20}
              </span>
            </span>
            <span className="text-gray-600 flex items-center gap-1">
              <span>🔄</span>
              Còn lại: <span className="font-bold text-gray-900">
                {product.featuredConfig?.remainingStock ?? ((product.total || 60) - (product.sold || 20))}
              </span>
            </span>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="space-y-2">
            <ProgressBar 
              sold={product.featuredConfig?.soldCount ?? product.sold ?? 20} 
              total={(product.featuredConfig?.soldCount ?? product.sold ?? 20) + (product.featuredConfig?.remainingStock ?? ((product.total || 60) - (product.sold || 20)))}
            />
          </div>

          {/* Enhanced Countdown Timer */}
          {product.featuredConfig?.isActive && (
            <div className="space-y-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3 sm:p-4 border border-orange-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">⏰</span>
                <p className="text-xs sm:text-sm font-bold text-gray-700">
                  Nhanh tay! Ưu đãi kết thúc sau:
                </p>
              </div>
              {isComplete ? (
                <div className="text-red-600 font-bold text-sm sm:text-base md:text-lg text-center bg-red-100 rounded-lg py-2">
                  ⏰ HẾT HẠN ƯU ĐÃI!
                </div>
              ) : (
                <CountdownTimer timeLeft={timeLeft} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Enhanced large layout - Mobile-first
  return (
    <div className="group relative w-full max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl hover:shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative flex flex-col lg:flex-row">
        {/* Ultra Enhanced Product Image */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center relative overflow-hidden">
          {/* 3D Parallax Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-pink-100/30 to-blue-100/40 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          {/* Animated Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-2000 ease-out"></div>
          
          {/* Multi-layer Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          {/* Main Image Container with 3D Effect */}
          <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg group/image aspect-[4/3] overflow-hidden rounded-3xl transform perspective-1000" style={{height: '220px', minHeight: '220px'}}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            
            {/* 3D Image Container */}
            <div className="relative w-full h-full transform transition-all duration-1000 group-hover/image:scale-110 group-hover/image:rotate-y-15 group-hover/image:rotate-x-8">
              <Image 
                src={product.image || "/default-image.png"} 
                alt="Product Pack"
                width={240}
                height={180}
                className="w-full h-full object-cover transition-all duration-1000 group-hover/image:scale-105 group-hover/image:rotate-3 rounded-3xl drop-shadow-2xl"
                priority
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-xl"></div>
              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-ping shadow-xl"></div>
              <div className="absolute top-1/2 -right-2 w-4 h-4 bg-gradient-to-r from-green-400 to-teal-500 rounded-full animate-bounce shadow-lg"></div>
            </div>
            
            {/* Enhanced Floating Discount Badge */}
            <div className="absolute top-6 right-6 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-2xl transform rotate-12 hover:rotate-0 transition-all duration-500 hover:scale-125 hover:shadow-3xl border border-white/30">
              <span className="relative z-10">-{discountPercentage}%</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 rounded-full"></div>
            </div>
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-br-3xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-blue-500 to-purple-500 rounded-tl-3xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-700"></div>
            
            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover/image:opacity-100 transition-opacity duration-700 rounded-b-3xl"></div>
          </div>
        </div>

        {/* Enhanced Product Details */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7">
          {/* Enhanced Rating */}
          <div className="flex items-center justify-between">
            <RatingStars rating={3} />
            <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gradient-to-r from-orange-100 to-red-100 px-3 py-1 rounded-full">
              <span>🔥</span>
              <span className="font-bold">HOT DEAL</span>
            </div>
          </div>

          {/* Enhanced Product Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight group-hover:text-gray-800 transition-colors duration-300">
            {product.name || "SHAMPOO, CONDITIONER & FACEWASH PACKS"}
          </h1>

          {/* Enhanced Description */}
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed line-clamp-3">
            {product.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptates, quod, quia, voluptate quae voluptatem quibusdam voluptatibus quos quas nesciunt."}
          </p>

          {/* Enhanced Price */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-pink-600 bg-clip-text text-transparent">
              {(product.price || 100000).toLocaleString('vi-VN')}đ
            </span>
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-400 line-through">
              {(product.originalPrice || 2000000).toLocaleString('vi-VN')}đ
            </span>
          </div>

          {/* Enhanced Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={isComplete}
            className={`w-fit font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-2xl transition-all duration-300 transform text-lg sm:text-xl md:text-2xl relative overflow-hidden ${
              isComplete 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-inner' 
                : 'bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95'
            }`}
          >
            {/* Button shine effect */}
            {!isComplete && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
            )}
            <span className="relative z-10 flex items-center justify-center gap-3">
              {!isComplete && <span className="text-2xl">🛒</span>}
              {isComplete ? '⏰ HẾT HẠN ƯU ĐÃI!' : 'Thêm Vào Giỏ'}
            </span>
          </button>

          {/* Enhanced Stock Information */}
          <div className="flex justify-between items-center text-sm sm:text-base md:text-lg bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-5">
            <span className="text-gray-600 flex items-center gap-2">
              <span className="text-xl">📦</span>
              Đã bán: <span className="font-bold text-gray-900">20</span>
            </span>
            <span className="text-gray-600 flex items-center gap-2">
              <span className="text-xl">🔄</span>
              Còn lại: <span className="font-bold text-gray-900">40</span>
            </span>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="space-y-3">
            <ProgressBar sold={20} total={60} />
          </div>

          {/* Enhanced Countdown Timer */}
          <div className="space-y-4 bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 rounded-2xl p-4 sm:p-6 border border-orange-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⏰</span>
              <p className="text-sm sm:text-base md:text-lg font-bold text-gray-700">
                Nhanh tay! Ưu đãi kết thúc sau:
              </p>
            </div>
            {isComplete ? (
              <div className="text-red-600 font-bold text-lg sm:text-xl md:text-2xl text-center bg-red-100 rounded-xl py-4">
                ⏰ HẾT HẠN ƯU ĐÃI!
              </div>
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