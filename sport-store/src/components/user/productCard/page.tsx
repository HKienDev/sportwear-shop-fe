"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  category: string; // ID của thể loại
  price: number;
  discountPrice?: number;
  description: string;
  images: {
    main: string;
    sub?: string[];
  };
}

interface ProductCardProps {
  product: Product;
  categories: Category[]; // Danh sách thể loại
}

const formatCurrency = (amount: number) => {
  return amount.toLocaleString("vi-VN") + "đ";
};

const ProductCard: React.FC<ProductCardProps> = ({ product, categories }) => {
  const { _id, name, category, price, discountPrice, description, images } = product;

  // Tìm tên thể loại dựa trên ID
  const categoryName =
    categories.find((cat) => cat._id === category)?.name || "Không xác định";

  return (
    <Link href={`/user/products/details/${_id}`} className="block">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 group">
        {discountPrice !== undefined && discountPrice > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Sale
          </div>
        )}
        <div className="relative w-full h-64 overflow-hidden">
          <Image
            src={images?.main || "/default-image.png"}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        </div>
        <div className="p-5">
          <div className="mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {categoryName} {/* Hiển thị tên thể loại */}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {discountPrice !== undefined && discountPrice > 0 ? (
                <>
                  <span className="text-lg font-bold text-red-500 mr-2">
                    {formatCurrency(discountPrice)}
                  </span>
                  <span className="text-sm line-through text-gray-400">
                    {formatCurrency(price)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-800">
                  {formatCurrency(price)}
                </span>
              )}
            </div>
            <button className="flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;