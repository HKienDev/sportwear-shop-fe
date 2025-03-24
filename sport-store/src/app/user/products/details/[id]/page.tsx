"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  discountPrice: string;
  description: string;
  image?: string;
}

const ProductDetails = () => {
  const { id } = useParams(); // ✅ Lấy id từ URL
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/products/${id}`);
        if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center">Đang tải...</p>;
  if (!product) return <p className="text-center">Không tìm thấy sản phẩm</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-gray-500">{product.category}</p>
      
      <div className="relative w-full h-80 mt-4">
        <Image 
          src={product.image || "/shoes.png"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover rounded-lg"
        />
      </div>

      <p className="text-lg font-semibold text-red-500 mt-4">
        {product.discountPrice ? product.discountPrice : product.price}
      </p>
      {product.discountPrice && (
        <p className="text-gray-400 line-through">{product.price}</p>
      )}

      <p className="mt-4 text-gray-700">{product.description}</p>
    </div>
  );
};

export default ProductDetails;