"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Star, Eye, Check } from "lucide-react";
import { UserProduct } from "@/types/product";
import { getCategoryById } from "@/services/categoryService";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: UserProduct;
}

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || amount === null) return "0đ";
  return amount.toLocaleString("vi-VN") + "đ";
};

// Rating Stars Component - Mobile optimized
const RatingStars = ({ rating = 4.5 }: { rating?: number }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <Star
          key={star}
          size={10}
          className={`${
            star <= rating 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="text-[10px] text-gray-500 ml-1">({rating})</span>
    </div>
  );
};

// Mobile-optimized Cart Button
const CartButton = ({ 
  onClick, 
  disabled, 
  isAdding = false 
}: { 
  onClick: (e: React.MouseEvent) => void; 
  disabled: boolean; 
  isAdding?: boolean;
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!disabled && !isAdding) {
      setIsClicked(true);
      onClick(e);
      setTimeout(() => setIsClicked(false), 1000);
    }
  };

  if (disabled) {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-400 cursor-not-allowed">
        <ShoppingCart className="h-4 w-4" />
      </div>
    );
  }

  return (
    <button 
      onClick={handleClick}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden touch-manipulation ${
        isAdding || isClicked
          ? 'bg-green-500 text-white border-2 border-green-400'
          : 'bg-white/95 backdrop-blur-sm text-gray-700 hover:text-purple-600 border-2 border-gray-200 hover:border-purple-300'
      }`}
      disabled={disabled || isAdding}
      aria-label="Thêm vào giỏ hàng"
    >
      {/* Subtle shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500"></div>
      
      {/* Icon with smooth animation */}
      <div className="relative z-10 flex items-center justify-center">
        {isAdding || isClicked ? (
          <Check className="h-4 w-4 animate-pulse" />
        ) : (
          <ShoppingCart className="h-4 w-4 transition-all duration-300" />
        )}
      </div>

      {/* Success ring animation */}
      {(isAdding || isClicked) && (
        <div className="absolute inset-0 border-2 border-green-400 rounded-full animate-ping opacity-30"></div>
      )}
    </button>
  );
};



const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, categoryId, originalPrice, salePrice, description, mainImage, stock, sku, colors, sizes } = product;
  const [categoryName, setCategoryName] = useState<string>("Đang tải...");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        if (categoryId) {
          const response = await getCategoryById(categoryId);
          if (response && response.success && response.data) {
            setCategoryName(response.data.name);
          } else {
            setCategoryName("Không xác định");
          }
        } else {
          setCategoryName("Không xác định");
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.message?.includes('Failed to fetch category')) {
          setCategoryName("Không xác định");
        } else {
          console.error("Lỗi khi lấy thông tin category:", error);
          setCategoryName("Không xác định");
        }
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card click when clicking cart button
    
    if (stock === 0) {
      toast.error("Sản phẩm đã hết hàng!");
      return;
    }

    setIsAddingToCart(true);

    try {
      const defaultColor = colors && colors.length > 0 ? colors[0] : "";
      const defaultSize = sizes && sizes.length > 0 ? sizes[0] : "";
      
      const cartData = {
        sku,
        color: defaultColor,
        size: defaultSize,
        quantity: 1
      };

      await addToCart(cartData);
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    } finally {
      setTimeout(() => setIsAddingToCart(false), 1000);
    }
  };

  const handleProductClick = () => {
    const encodedSku = encodeURIComponent(sku);
    router.push(`/user/products/details/${encodedSku}`);
  };

  const imageUrl = mainImage || "/default-image.png";
  const discountPercentage = salePrice > 0 
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  return (
    <article 
      className="group relative bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-gray-200 hover:border-gray-300 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 w-full mx-auto cursor-pointer flex flex-col"
      style={{
        minHeight: '380px',
        maxHeight: '500px',
        width: 'clamp(280px, 100%, 400px)'
      }}
      role="article"
      aria-label={`Sản phẩm: ${name}`}
      onClick={handleProductClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleProductClick();
        }
      }}
      tabIndex={0}
    >
      {/* Enhanced Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/40 via-pink-50/20 to-blue-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Product Image Container - tăng chiều cao */}
      <div 
        className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center group/image overflow-hidden rounded-t-2xl sm:rounded-t-3xl"
        style={{
          height: 'clamp(200px, 60%, 300px)'
        }}
      >
        {/* Enhanced overlay effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-pink-100/10 to-blue-100/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/image:translate-x-full transition-transform duration-1500 ease-out"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 via-transparent to-pink-500/3 opacity-0 group-hover/image:opacity-100 transition-opacity duration-700"></div>
        
        {/* Image with enhanced loading and hover effects */}
        <div className="relative w-full h-full flex items-center justify-center transform perspective-1000">
          <div className="relative w-full h-full transform transition-all duration-700 group-hover/image:scale-105 group-hover/image:rotate-y-2 group-hover/image:rotate-x-1">
            <Image 
              src={imageUrl} 
              alt={name}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="w-full h-full object-cover transition-all duration-700 group-hover/image:scale-105 group-hover/image:rotate-1 drop-shadow-lg"
              priority
              loading="eager"
            />
          </div>
        </div>
        
        {/* Enhanced Action Buttons - Higher z-index to ensure visibility */}
        <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 flex flex-col gap-1 sm:gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 z-30">
          <button
            className="w-8 h-8 sm:w-9 sm:h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 hover:border-white/80 transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Yêu thích sản phẩm"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
          </button>
          <button
            className="w-8 h-8 sm:w-9 sm:h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 hover:border-white/80 transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Xem nhanh sản phẩm"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
          </button>
        </div>
        
        {/* Enhanced Badges - Clean design without brand badge */}
        {salePrice > 0 && (
          <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white text-[clamp(0.625rem,1.5vw,0.75rem)] font-bold px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-full border-2 border-white/30 truncate max-w-[clamp(60px,15vw,80px)] animate-pulse z-10">
            -{discountPercentage}%
          </div>
        )}
        
        {stock === 0 && (
          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white text-[clamp(0.625rem,1.5vw,0.75rem)] font-bold px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-full shadow-lg border border-white/20">
            Hết hàng
          </div>
        )}
      </div>
      
      {/* Enhanced Product Details - Mobile-first responsive */}
      <div 
        className="relative flex flex-col flex-1 gap-1 px-3 py-2 sm:px-4 sm:py-3"
      >
        {/* Category + Rating */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-purple-600 bg-gradient-to-r from-purple-50 to-pink-50 px-2 py-1 rounded-full border border-purple-200/50 truncate max-w-[60%] hover:from-purple-100 hover:to-pink-100 transition-colors duration-200">
            {categoryName}
          </span>
          <RatingStars rating={product.rating || 0} />
        </div>
        {/* Product Name */}
        <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-gray-800 transition-colors duration-300">
          {name}
        </h3>
        {/* Price + Cart */}
        <div className="flex items-end gap-2 sm:gap-3 flex-wrap mt-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0 flex-1">
            <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent truncate">
              {formatCurrency(salePrice > 0 ? salePrice : originalPrice)}
            </span>
            {salePrice > 0 && (
              <span className="text-xs sm:text-sm text-gray-400 line-through truncate">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
          <CartButton 
            onClick={handleAddToCart}
            disabled={stock === 0}
            isAdding={isAddingToCart}
          />
        </div>
        {/* Stock status */}
        <div className="flex items-center justify-between text-xs mt-1">
          <span className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors duration-200 ${
            stock > 0 
              ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' 
              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
          }`}>
            <span className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              stock > 0 ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            {stock > 0 ? 'Còn hàng' : 'Hết hàng'}
          </span>
          <span className="text-gray-500 truncate font-medium">
            {stock} trong kho
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;