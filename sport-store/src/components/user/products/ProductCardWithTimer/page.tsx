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
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transform transition-all duration-300 hover:border-purple-300 hover:scale-105 min-w-[240px] sm:min-w-[280px] md:min-w-[320px] lg:min-w-[360px]">
        {/* Product Image - Mobile-first */}
        <div className="relative h-36 sm:h-40 md:h-48 lg:h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Image 
            src={product.image || "/default-image.png"} 
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
            disabled={isComplete}
            className={`w-full font-semibold py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 rounded-lg transition-all duration-300 transform text-sm sm:text-base md:text-lg ${
              isComplete 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-black hover:to-gray-800 text-white hover:scale-105'
            }`}
          >
            {isComplete ? 'HẾT HẠN ƯU ĐÃI!' : 'Thêm Vào Giỏ'}
          </button>

          {/* Stock Information - Mobile-first */}
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-gray-600">
              Đã bán: <span className="font-semibold text-gray-900">
                {product.featuredConfig?.soldCount ?? product.sold ?? 20}
              </span>
            </span>
            <span className="text-gray-600">
              Còn lại: <span className="font-semibold text-gray-900">
                {product.featuredConfig?.remainingStock ?? ((product.total || 60) - (product.sold || 20))}
              </span>
            </span>
          </div>

          {/* Progress Bar */}
          <ProgressBar 
            sold={product.featuredConfig?.soldCount ?? product.sold ?? 20} 
            total={(product.featuredConfig?.soldCount ?? product.sold ?? 20) + (product.featuredConfig?.remainingStock ?? ((product.total || 60) - (product.sold || 20)))}
          />

          {/* Countdown Timer - Mobile-first */}
          {product.featuredConfig?.isActive && (
            <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
              <p className="text-xs sm:text-sm font-semibold text-gray-700">
                ⏰ Nhanh tay! Ưu đãi kết thúc sau:
              </p>
              {isComplete ? (
                <div className="text-red-500 font-bold text-sm sm:text-base md:text-lg">HẾT HẠN ƯU ĐÃI!</div>
              ) : (
                <CountdownTimer timeLeft={timeLeft} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Original large layout - Mobile-first
  return (
    <div className="w-full max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto bg-white rounded-lg border border-gray-200 overflow-hidden transform transition-all duration-300 hover:border-purple-300">
      <div className="flex flex-col lg:flex-row">
        {/* Product Image - Mobile-first */}
        <div className="w-full lg:w-1/2 p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg group aspect-[4/3] overflow-hidden" style={{height: '160px', minHeight: '160px'}}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Image 
              src={product.image || "/default-image.png"} 
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
            disabled={isComplete}
            className={`w-fit font-semibold py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 rounded-lg transition-all duration-300 transform text-sm sm:text-base md:text-lg ${
              isComplete 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-black hover:to-gray-800 text-white hover:scale-105'
            }`}
          >
            {isComplete ? 'HẾT HẠN ƯU ĐÃI!' : 'Thêm Vào Giỏ'}
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
              <div className="text-red-500 font-bold text-sm sm:text-base md:text-lg">HẾT HẠN ƯU ĐÃI!</div>
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