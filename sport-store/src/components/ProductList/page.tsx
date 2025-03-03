"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  salePrice: string;
  subtitle: string;
  image?: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch("https://676383e717ec5852cae91a1b.mockapi.io/sports-shop/api/v1/Products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data: Product[] = await res.json();
    console.log("Fetched Products:", data);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const ProductCard = ({ name, category, price, salePrice, subtitle, image }: Product) => (
  <div className="bg-[#F8F8F8] p-5 rounded-lg shadow-md mb-4 border">
    {/* Image Wrapper */}
    <div className="relative w-full h-52 overflow-hidden rounded-lg">
      <Image 
        src={image || "/shoes.png"} 
        alt={name} 
        fill
        sizes="(max-width: 768px) 100vw, 400px"
        className="object-cover rounded-lg"
        priority 
      />
    </div>

    {/* Nội dung sản phẩm */}
    <div className="mt-4">
      <h3 className="text-sm font-bold">{name}</h3>
      <p className="text-gray-500 font-semibold text-xs mt-1">{category}</p> 
      <p className="text-gray-500 font-medium text-xs mt-1">{subtitle}</p>
      <div className="flex justify-between items-center mt-2">
        <div className="text-red-500 font-medium">
          {salePrice ? (
            <>
              <span className="line-through text-gray-400 mr-2">{price}</span>
              {salePrice}
            </>
          ) : (
            price
          )}
        </div>
        <button className="text-red-500 font-semibold text-sm">Yêu thích ♡</button>
      </div>
    </div>
  </div>
);

const ProductList = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Invalid data format:", data);
      }
      setLoading(false);
    };
    getProducts();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold text-center mb-6">Danh sách sản phẩm</h2>
      {loading ? (
        <p className="text-center text-gray-500">Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
export { ProductCard };