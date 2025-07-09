"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Star, Eye, Plus, Check } from "lucide-react";
import { UserProduct } from "@/types/product";
import { getCategoryById } from "@/services/categoryService";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import styles from './ProductCard.module.css';

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
          ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
          : 'bg-white/95 backdrop-blur-sm text-gray-700 hover:text-purple-600 border border-gray-200/60 hover:border-purple-300/70 shadow-sm hover:shadow-md'
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

// Enhanced Badge giảm giá
const DiscountBadge = ({ discountPercentage = 0 }: { discountPercentage?: number }) => {
  return (
    <div className={`absolute top-3 sm:top-4 left-3 sm:left-4 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[clamp(0.75rem,2vw,0.875rem)] font-bold px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full shadow-lg ${styles.animatePulse}`}>
      -{discountPercentage}%
    </div>
  );
};

// Enhanced Badge hết hàng
const OutOfStockBadge = () => {
  return (
    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 bg-gradient-to-r from-gray-700 to-gray-800 text-white text-[clamp(0.75rem,2vw,0.875rem)] font-bold px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full shadow-lg">
      Hết hàng
    </div>
  );
};

// Enhanced Brand Badge
const BrandBadge = ({ brand }: { brand: string }) => {
  return (
    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[clamp(0.625rem,1.5vw,0.75rem)] font-bold px-[clamp(0.5rem,1.5vw,0.75rem)] py-[clamp(0.25rem,0.75vw,0.375rem)] rounded-full shadow-lg">
      {brand}
    </div>
  );
};

// Enhanced Container ảnh
const ImageContainer = ({ imageUrl, name }: { imageUrl: string; name: string }) => {
  return (
    <div className={`${styles.imageContainer} relative overflow-hidden rounded-t-2xl sm:rounded-t-3xl flex-shrink-0`}>
      <div className={`${styles.imageWrapper} relative w-full h-full`}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          className={`${styles.productImage} object-cover transition-all duration-700 ease-out`}
          priority
        />
      </div>
      
      {/* Enhanced Overlay khi hover */}
      <div className={`${styles.imageOverlay} absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
      
      {/* Enhanced Action Buttons */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <button 
          className={`p-2 sm:p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 transition-all duration-300 hover:scale-110 ${styles.buttonHover}`}
          aria-label="Yêu thích sản phẩm"
        >
          <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
        <button 
          className={`p-2 sm:p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-50 transition-all duration-300 hover:scale-110 ${styles.buttonHover}`}
          aria-label="Xem chi tiết"
        >
          <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-blue-500 transition-colors" />
        </button>
      </div>

      {/* Enhanced Quick View Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 sm:p-4 shadow-lg transform scale-75 group-hover:scale-100 transition-all duration-300">
          <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
        </div>
      </div>
    </div>
  );
};

// Enhanced Container thông tin
const InfoContainer = ({ name, categoryName, rating, description, price, stock }: {
  name: string;
  categoryName: string;
  rating: number;
  description: string;
  price: number | undefined;
  stock: number;
}) => {
  return (
    <div className="p-[clamp(1rem,3vw,1.5rem)] flex flex-col flex-grow relative z-10">
      {/* Enhanced Category */}
      <div className="mb-[clamp(0.75rem,2vw,1rem)]">
        <span className="text-[clamp(0.625rem,1.5vw,0.75rem)] font-bold text-purple-600 bg-gradient-to-r from-purple-50 to-pink-50 px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.375rem,1vw,0.5rem)] rounded-full border border-purple-200/50 shadow-sm">
          {categoryName}
        </span>
      </div>

      {/* Enhanced Rating */}
      <div className="mb-[clamp(0.5rem,1.5vw,0.75rem)]">
        <RatingStars rating={rating} />
      </div>

      {/* Enhanced Tên sản phẩm */}
      <h3 className={`text-[clamp(0.875rem,2.5vw,1.125rem)] font-bold text-gray-800 mb-[clamp(0.5rem,1.5vw,0.75rem)] line-clamp-2 group-hover:text-purple-600 transition-colors duration-300 leading-tight ${styles.textResponsive}`}>
        {name}
      </h3>

      {/* Enhanced Mô tả */}
      <p className={`text-gray-600 text-[clamp(0.75rem,2vw,0.875rem)] mb-[clamp(1rem,3vw,1.25rem)] line-clamp-2 leading-relaxed ${styles.textResponsive}`}>
        {description}
      </p>

      {/* Enhanced Giá và nút mua */}
      <div className="flex justify-between items-center mt-auto gap-[clamp(0.5rem,1.5vw,0.75rem)]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0 flex-1">
          {price > 0 ? (
            <>
              <span className="text-[clamp(0.875rem,2.5vw,1.125rem)] font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent truncate">
                {formatCurrency(price)}
              </span>
              <span className="text-[clamp(0.625rem,1.5vw,0.75rem)] line-through text-gray-400 truncate">
                {formatCurrency(price)}
              </span>
            </>
          ) : (
            <span className="text-[clamp(0.875rem,2.5vw,1.125rem)] font-bold text-gray-800 truncate">
              {formatCurrency(price)}
            </span>
          )}
        </div>
        
        {/* Enhanced Stock Status */}
        <div className="mt-[clamp(0.75rem,2vw,1rem)] flex items-center justify-between text-[clamp(0.625rem,1.5vw,0.75rem)]">
          <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${
            stock > 0 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              stock > 0 ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            {stock > 0 ? 'Còn hàng' : 'Hết hàng'}
          </span>
          <span className="text-gray-500 truncate">
            {stock} trong kho
          </span>
        </div>
      </div>
    </div>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, categoryId, originalPrice, salePrice, description, mainImage, stock, sku, colors, sizes, brand } = product;
  const [categoryName, setCategoryName] = useState<string>("Đang tải...");
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCartStore();

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

  const imageUrl = mainImage || "/default-image.png";
  const discountPercentage = salePrice > 0 
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="group relative w-full bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 min-w-[240px] sm:min-w-[280px] md:min-w-[320px] lg:min-w-[360px]">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      {/* Product Image - Ultra Enhanced */}
      <div className="relative h-36 sm:h-44 md:h-52 lg:h-56 bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center group/image overflow-hidden rounded-t-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-pink-100/20 to-blue-100/30 opacity-0 group-hover/image:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/image:translate-x-full transition-transform duration-1500 ease-out"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover/image:opacity-100 transition-opacity duration-700"></div>
        <div className="relative w-full h-full flex items-center justify-center transform perspective-1000">
          <div className="relative w-full h-full transform transition-all duration-700 group-hover/image:scale-110 group-hover/image:rotate-y-12 group-hover/image:rotate-x-6">
            <Image 
              src={imageUrl} 
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              className="w-full h-full object-cover transition-all duration-700 group-hover/image:scale-105 group-hover/image:rotate-2 drop-shadow-2xl"
              priority
            />
          </div>
        </div>
        {/* Discount Badge */}
        {salePrice > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-xl border border-white/20">
            -{discountPercentage}%
          </div>
        )}
        {/* Brand Badge */}
        {brand && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-white/20">
            {brand}
          </div>
        )}
        {/* Out of stock badge */}
        {stock === 0 && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full shadow-xl border border-white/20">
            Hết hàng
          </div>
        )}
      </div>
      {/* Product Details - Enhanced */}
      <div className="relative p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3 flex flex-col flex-1">
        {/* Category + Rating */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-purple-600 bg-gradient-to-r from-purple-50 to-pink-50 px-2 py-1 rounded-full border border-purple-200/50 truncate max-w-[60%]">
            {categoryName}
          </span>
          <RatingStars rating={4.5} />
        </div>
        {/* Product Title */}
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-gray-800 transition-colors duration-300">
          {name}
        </h3>
        {/* Description */}
        <p className="text-gray-600 text-xs sm:text-sm mb-1 line-clamp-2 leading-relaxed flex-grow">
          {description}
        </p>
        {/* Price + Cart Button */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap mt-auto">
          <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
            {formatCurrency(salePrice > 0 ? salePrice : originalPrice)}
          </span>
          {salePrice > 0 && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              {formatCurrency(originalPrice)}
            </span>
          )}
          <div className="flex-1"></div>
          <button 
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md border-none outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 ${
              stock === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-purple-500/25 hover:shadow-purple-500/40'
            }`}
            aria-label="Thêm vào giỏ hàng"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
        {/* Stock status */}
        <div className="flex items-center justify-between text-[10px] mt-1">
          <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full ${
            stock > 0 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              stock > 0 ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            {stock > 0 ? 'Còn hàng' : 'Hết hàng'}
          </span>
          <span className="text-gray-500 truncate">
            {stock} trong kho
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;