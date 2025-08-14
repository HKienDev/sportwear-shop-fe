"use client";

import React, { useState, useCallback, useMemo, memo } from "react";
import { useCartOptimized } from "@/hooks/useCartOptimized";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/context/authContext";
import { useAuthModal } from "@/context/authModalContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Eye, Clock, Star, TrendingUp, Zap } from "lucide-react";
import Image from "next/image";
import { useCountdown } from "@/hooks/useCountdown";
import { FeaturedProduct } from "@/types/product";

// Enhanced Countdown Timer with Circular Progress
const CountdownTimer = memo(({ timeLeft }: { timeLeft: { days: number; hours: number; minutes: number; seconds: number } }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      <h4 className="font-bold text-gray-900 text-sm">Ưu đãi kết thúc sau:</h4>
    </div>
    <div className="grid grid-cols-4 gap-2 max-w-xs">
      {[
        { value: timeLeft.days, label: 'Ngày' },
        { value: timeLeft.hours, label: 'Giờ' },
        { value: timeLeft.minutes, label: 'Phút' },
        { value: timeLeft.seconds.toString().padStart(2, '0'), label: 'Giây' }
      ].map((item, index) => (
        <div key={index} className="relative group">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-2 text-center border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
            <div className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{item.value}</div>
            <div className="text-xs text-gray-500 font-medium">{item.label}</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl"></div>
        </div>
      ))}
    </div>
  </div>
));

CountdownTimer.displayName = 'CountdownTimer';

// Enhanced Rating Stars with Animation
const RatingStars = memo(({ rating }: { rating: number }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 transition-all duration-300 hover:scale-110 ${
            index < rating 
              ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' 
              : 'fill-transparent text-gray-300'
          }`}
        />
      ))}
    </div>
    <span className="text-sm font-medium text-gray-600">({rating.toFixed(1)})</span>
    <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
      <TrendingUp className="w-3 h-3" />
      <span>Hot</span>
    </div>
  </div>
));

RatingStars.displayName = 'RatingStars';

// Enhanced Progress Bar with Animation
const ProgressBar = memo(({ sold, total }: { sold: number; total: number }) => {
  const percentage = useMemo(() => (sold / total) * 100, [sold, total]);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-700 font-medium">Đã bán: <strong className="text-gray-900">{sold}</strong></span>
        <span className="text-gray-700 font-medium">Còn lại: <strong className="text-gray-900">{total - sold}</strong></span>
      </div>
      <div className="relative w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{ 
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #FF8F9C 0%, #FF6B7A 100%)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
        </div>
      </div>
      {percentage > 80 && (
        <div className="flex items-center gap-1 text-xs text-red-600 font-medium animate-pulse">
          <Zap className="w-3 h-3" />
          <span>Chỉ còn {total - sold} sản phẩm!</span>
        </div>
      )}
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

// Quick Actions Component
const QuickActions = memo(({ onViewDetails, onWishlist, isWishlisted, isToggling }: { 
  onViewDetails: () => void;
  onWishlist: () => void;
  isWishlisted: boolean;
  isToggling: boolean;
}) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 z-10">
      <button
        onClick={onViewDetails}
        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-white/20 flex items-center justify-center"
      >
        <Eye className="w-4 h-4 text-gray-700" />
      </button>
      <button
        onClick={onWishlist}
        disabled={isToggling}
        className={`w-10 h-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-white/20 flex items-center justify-center ${
          isWishlisted 
            ? 'bg-red-500 text-white' 
            : 'bg-white/90 backdrop-blur-sm text-gray-700'
        }`}
      >
        {isToggling ? (
          <div className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        )}
      </button>
    </div>
  );
});

QuickActions.displayName = 'QuickActions';

interface ProductCardWithTimerProps {
  product?: FeaturedProduct & {
    description?: string;
    colors?: string[];
    sizes?: string[];
  };
}

const ProductCardWithTimer = ({ 
  product = {
    id: "default-id",
    name: "SHAMPOO, CONDITIONER & FACEWASH PACKS",
    price: 150000,
    originalPrice: 200000,
    sold: 20,
    total: 60,
    rating: 0,
    image: "/default-image.png",
    sku: "DEFAULT-SKU",
    brand: "Default Brand",
    category: "Default Category",
    description: "Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor dolor sit amet consectetur Lorem ipsum dolor"
  }
}: ProductCardWithTimerProps) => {
  const { addToCart } = useCartOptimized();
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  // Countdown calculation
  const countdownConfig = useMemo(() => {
    if (product.featuredConfig?.countdownEndDate) {
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
    
    return {
      days: 360,
      hours: 24,
      minutes: 59,
      seconds: 0,
      isComplete: false
    };
  }, [product.featuredConfig]);

  const { timeLeft, isComplete } = useCountdown({
    initialDays: countdownConfig.days,
    initialHours: countdownConfig.hours,
    initialMinutes: countdownConfig.minutes,
    initialSeconds: countdownConfig.seconds,
    onComplete: () => {
      console.log('Countdown completed!');
    }
  });

  const discountAmount = useMemo(() => (product.originalPrice || 200000) - (product.price || 150000), [product.originalPrice, product.price]);
  const discountPercentage = useMemo(() => Math.round((discountAmount / (product.originalPrice || 200000)) * 100), [discountAmount, product.originalPrice]);

  const handleAddToCart = useCallback(async () => {
    if (!isAuthenticated) {
      // Mở auth modal thay vì redirect
      openModal({
        title: 'Đăng nhập để thêm vào giỏ hàng',
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng',
        pendingAction: {
          type: 'addToCart',
          data: product,
          callback: () => {
            // Thực hiện lại action sau khi đăng nhập
            handleAddToCart();
          }
        }
      });
      return;
    }

    if (isComplete) {
      toast.error("Ưu đãi đã hết hạn!");
      return;
    }

    if (!product.sku) {
      toast.error("Không tìm thấy thông tin sản phẩm");
      return;
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      
      let fullProduct = null;

      try {
        const productResponse = await fetch(`${API_URL}/api/products/sku/${product.sku}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (productResponse.ok) {
          const productData = await productResponse.json();
          fullProduct = productData.data;
        }
      } catch (error) {
        console.log('Endpoint 1 failed:', error);
      }

      if (!fullProduct) {
        try {
          const productResponse = await fetch(`${API_URL}/api/products?keyword=${product.sku}&limit=1`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          
          if (productResponse.ok) {
            const productData = await productResponse.json();
            if (productData.data && productData.data.length > 0) {
              fullProduct = productData.data[0];
            }
          }
        } catch (error) {
          console.log('Endpoint 2 failed:', error);
        }
      }

      if (!fullProduct) {
        fullProduct = product;
      }

      let color = undefined;
      let size = undefined;

      if (fullProduct.colors && Array.isArray(fullProduct.colors) && fullProduct.colors.length > 0) {
        color = fullProduct.colors[0];
      }

      if (fullProduct.sizes && Array.isArray(fullProduct.sizes) && fullProduct.sizes.length > 0) {
        if (typeof fullProduct.sizes[0] === 'object' && fullProduct.sizes[0].size) {
          size = fullProduct.sizes[0].size;
        } else {
          size = fullProduct.sizes[0];
        }
      }

      const cartData: { sku: string; quantity: number; color?: string; size?: string } = {
        sku: product.sku,
        quantity: 1
      };

      if (color) cartData.color = color;
      if (size) cartData.size = size;

      await addToCart(cartData);
      // Không cần fetchCart vì addToCart đã tự động sync
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (error: any) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      
      // Xử lý lỗi 401 - token hết hạn
      if (error?.status === 401 || error?.response?.status === 401) {
        console.log('🔍 ProductCardWithTimer - 401 error in handleAddToCart');
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi thêm vào giỏ hàng';
        toast.error(errorMessage);
      }
    }
  }, [isAuthenticated, product, addToCart, isComplete, openModal]);

  const handleViewDetails = useCallback(() => {
    router.push(`/user/products/${product.sku}`);
  }, [router, product.sku]);

  const handleWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      openModal({
        title: 'Đăng nhập để thêm vào yêu thích',
        description: 'Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích',
        pendingAction: {
          type: 'addToWishlist',
          data: { productId: product.id },
          callback: () => handleWishlist()
        }
      });
      return;
    }

    setIsTogglingWishlist(true);
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (error: any) {
      console.error('Error toggling wishlist:', error);
      
      // Xử lý lỗi 401 - token hết hạn
      if (error?.status === 401 || error?.response?.status === 401) {
        console.log('🔍 ProductCardWithTimer - 401 error in handleWishlist');
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Không thể thao tác với danh sách yêu thích';
        toast.error(errorMessage);
      }
    } finally {
      setIsTogglingWishlist(false);
    }
  }, [isAuthenticated, openModal, product.id, isInWishlist, addToWishlist, removeFromWishlist]);

  return (
    <div 
      className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 max-w-4xl mx-auto"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Quick Actions */}
      <QuickActions 
        onViewDetails={handleViewDetails}
        onWishlist={handleWishlist}
        isWishlisted={isInWishlist(product.id)}
        isToggling={isTogglingWishlist}
      />

      {/* Discount Badge */}
      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform -rotate-12 hover:rotate-0 transition-all duration-300 hover:scale-110 z-10">
        <span className="relative z-10">-{discountPercentage}%</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500 rounded-full"></div>
      </div>

      <div className="flex flex-col md:flex-row relative z-10">
        {/* Product Image - Left Side (40%) */}
        <div className="w-full md:w-2/5 h-64 md:h-auto bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6 group/image overflow-hidden">
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-pink-100/10 to-blue-100/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/image:translate-x-full transition-transform duration-1500 ease-out"></div>
          
          <div className="relative w-full h-full flex items-center justify-center transform perspective-1000">
            <div className="relative w-full h-full transform transition-all duration-700 group-hover/image:scale-110 group-hover/image:rotate-y-6">
              <Image 
                src={product.image || "/default-image.png"} 
                alt={product.name || "Product"}
                width={300}
                height={300}
                className="w-full h-full object-contain transition-all duration-700 group-hover/image:scale-105 drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>

        {/* Product Details - Right Side (60%) */}
        <div className="w-full md:w-3/5 p-6 space-y-4">
          {/* Rating & Hot Badge */}
          <RatingStars rating={product.rating || 0} />

          {/* Product Title */}
          <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent uppercase leading-tight">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Enhanced Price Display */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                {(product.price || 150000).toLocaleString('en-US')}đ
              </span>
              <span className="text-lg text-gray-400 line-through">
                {(product.originalPrice || 200000).toLocaleString('en-US')}đ
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
              <Zap className="w-4 h-4" />
              <span>Tiết kiệm {discountAmount.toLocaleString('en-US')}đ ({discountPercentage}%)</span>
            </div>
          </div>

          {/* Enhanced Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={isComplete}
            className={`w-2/3 py-3 px-6 rounded-xl font-bold transition-all duration-300 transform relative overflow-hidden ${
              isComplete 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-inner' 
                : 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 hover:from-pink-600 hover:to-red-600'
            }`}
            onMouseEnter={(e) => {
              if (!isComplete) {
                e.currentTarget.style.background = 'linear-gradient(90deg, #000000 0%, #333333 100%)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isComplete) {
                e.currentTarget.style.background = 'linear-gradient(90deg, #FF8F9C 0%, #FF6B7A 100%)';
              }
            }}
          >
            {!isComplete && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {!isComplete && <ShoppingCart className="w-4 h-4" />}
              {isComplete ? (
                <>
                  <Clock className="w-4 h-4" />
                  HẾT HẠN!
                </>
              ) : (
                'THÊM VÀO GIỎ'
              )}
            </span>
          </button>

          {/* Enhanced Progress Bar */}
          <ProgressBar 
            sold={product.featuredConfig?.soldCount ?? product.sold ?? 20} 
            total={(product.featuredConfig?.soldCount ?? product.sold ?? 20) + (product.featuredConfig?.remainingStock ?? ((product.total || 60) - (product.sold || 20)))}
          />

          {/* Enhanced Countdown Timer */}
          <div className="pt-4 border-t border-gray-100/50">
            {isComplete ? (
              <div className="text-red-600 font-bold text-center bg-red-50 rounded-lg py-3">
                <Zap className="w-5 h-5 inline mr-2" />
                HẾT HẠN ƯU ĐÃI!
              </div>
            ) : (
              <CountdownTimer timeLeft={timeLeft} />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

export default memo(ProductCardWithTimer); 