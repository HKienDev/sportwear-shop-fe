"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  discountPrice: string;
  subtitle: string;
  image?: string;
}

const ProductCard = ({ id, name, category, price, discountPrice, subtitle, image }: Product) => (
  <Link href={`/user/products/detail/${id}`} className="block">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 group">
      {discountPrice && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Sale
        </div>
      )}
      <div className="relative w-full h-64 overflow-hidden">
        <Image 
          src={image || "/shoes.png"} 
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
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{category}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{subtitle}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {discountPrice ? (
              <>
                <span className="text-lg font-bold text-red-500 mr-2">{discountPrice}</span>
                <span className="text-sm line-through text-gray-400">{price}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">{price}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default ProductCard;