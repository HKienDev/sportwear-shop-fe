"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types/product";
import { getCategoryById } from "@/services/categoryService";
import { cartService } from "@/services/cartService";
import { toast } from "sonner";
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || amount === null) return "0đ";
  return amount.toLocaleString("vi-VN") + "đ";
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, categoryId, originalPrice, salePrice, description, mainImage, stock, sku, colors, sizes } = product;
  const [categoryName, setCategoryName] = useState<string>("Đang tải...");

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
        // Nếu lỗi là 404 hoặc không tìm thấy, không log lỗi, chỉ set 'Không xác định'
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
    e.preventDefault(); // Ngăn chặn việc chuyển hướng
    
    if (stock === 0) {
      toast.error("Sản phẩm đã hết hàng!");
      return;
    }

    try {
      // Lấy giá trị mặc định
      const defaultColor = colors && colors.length > 0 ? colors[0] : "";
      const defaultSize = sizes && sizes.length > 0 ? sizes[0] : "";
      
      const cartData = {
        sku,
        color: defaultColor,
        size: defaultSize,
        quantity: 1
      };

      const response = await cartService.addToCart(cartData);
      
      if (response.success) {
        toast.success("Đã thêm sản phẩm vào giỏ hàng!");
      } else {
        // Kiểm tra nếu lỗi liên quan đến token
        if (response.message && response.message.includes('Phiên đăng nhập đã hết hạn')) {
          toast.error(response.message);
          // Không chuyển hướng ngay lập tức, để người dùng có thể thử lại
          return;
        }
        toast.error(response.message || "Có lỗi xảy ra khi thêm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
  };

  // Xử lý hình ảnh mặc định
  const imageUrl = mainImage || "/default-image.png";

  // Tính phần trăm giảm giá
  const discountPercentage = salePrice > 0 
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  return (
    <Link href={`/user/products/details/${sku}`} className="block">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden transition-all duration-300 hover:shadow-lg sm:hover:shadow-xl hover:scale-[1.02] sm:hover:scale-105 group h-[300px] sm:h-[340px] md:h-[380px] lg:h-[400px] xl:h-[420px] flex flex-col relative">
        {/* Badge giảm giá - Mobile-first */}
        {salePrice > 0 && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 bg-red-700 text-white text-xs sm:text-sm font-bold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full">
            -{discountPercentage}%
          </div>
        )}

        {/* Badge hết hàng - Mobile-first */}
        {stock === 0 && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 bg-gray-800 text-white text-xs sm:text-sm font-bold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full">
            Hết hàng
          </div>
        )}

        {/* Container ảnh - Mobile-first */}
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
              className={styles.productImage}
              priority
            />
          </div>
          {/* Overlay khi hover */}
          <div className={styles.imageOverlay}></div>
          
          {/* Nút yêu thích - Mobile-first */}
          <button className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 p-1.5 sm:p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-50" aria-label="Yêu thích sản phẩm">
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-red-500" />
          </button>
        </div>

        {/* Container thông tin - Mobile-first */}
        <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-grow">
          {/* Category - Mobile-first */}
          <div className="mb-2 sm:mb-2.5">
            <span className="text-xs sm:text-sm font-medium text-purple-600 bg-purple-50 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full">
              {categoryName}
            </span>
          </div>

          {/* Tên sản phẩm - Mobile-first */}
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-2 sm:mb-2.5 line-clamp-1 group-hover:text-purple-600 transition-colors">
            {name}
          </h3>

          {/* Mô tả - Mobile-first */}
          <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 line-clamp-2">{description}</p>

          {/* Giá và nút mua - Mobile-first */}
          <div className="flex justify-between items-center mt-auto">
            <div className="flex items-center">
              {salePrice > 0 ? (
                <>
                  <span className="text-sm sm:text-base md:text-lg font-bold text-red-700 mr-2 sm:mr-2.5">
                    {formatCurrency(salePrice)}
                  </span>
                  <span className="text-xs sm:text-sm line-through text-gray-400">
                    {formatCurrency(originalPrice)}
                  </span>
                </>
              ) : (
                <span className="text-sm sm:text-base md:text-lg font-bold text-gray-800">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
            <button 
              onClick={handleAddToCart}
              className={`flex items-center justify-center p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-300 ${
                stock === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
              disabled={stock === 0}
              aria-label="Thêm vào giỏ hàng"
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;