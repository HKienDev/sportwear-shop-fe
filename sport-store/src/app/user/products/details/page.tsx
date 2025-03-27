"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/user/productCard/page";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  discountPrice: string;
  subtitle: string;
  image?: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch("http://localhost:4000/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data: Product[] = await res.json();
    console.log("Fetched Products:", data); // Debug dữ liệu trả về
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

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
          {products?.map((product, index) => {
            console.log("Rendering ProductCard with ID:", product.id); // Debug ID
            return (
              <ProductCard key={product.id || `product-${index}`} {...product} />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;