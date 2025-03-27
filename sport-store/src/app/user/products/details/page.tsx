"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/user/productCard/page";

// Cập nhật lại interface Product
interface Product {
  _id: string;
  id: number;
  name: string;
  category: string;
  price: number;
  discountPrice: number;
  subtitle: string;
  description: string;
  images: { main: string; sub?: string[] }; // Sửa kiểu dữ liệu
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

    const data: unknown = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid API response format");
    }

    return data.map((product: Record<string, unknown>) => ({
      _id: typeof product._id === "string" ? product._id : "default-id",
      id: typeof product.id === "number" ? product.id : 0,
      name: typeof product.name === "string" ? product.name : "No name",
      category: typeof product.category === "string" ? product.category : "Uncategorized",
      price: typeof product.price === "string" ? Number(product.price) : 0,
      discountPrice: typeof product.discountPrice === "string" ? Number(product.discountPrice) : 0,
      subtitle: typeof product.subtitle === "string" ? product.subtitle : "No subtitle",
      description: typeof product.description === "string" ? product.description : "No description available",
      images: Array.isArray(product.images)
        ? { main: product.images[0] || "", sub: product.images.slice(1) } // Chuyển đổi mảng string[] thành object
        : { main: "" }, // Nếu không có ảnh, set giá trị mặc định
      image: typeof product.image === "string" ? product.image : "",
    }));
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
            console.log("Rendering ProductCard with ID:", product._id);
            return (
              <ProductCard key={product._id || `product-${index}`} {...product} />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;