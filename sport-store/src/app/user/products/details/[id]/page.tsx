"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Product {
  id: string; // Đổi thành string vì ObjectId là chuỗi
  name: string;
  category: string;
  price: string;
  discountPrice?: string;
  description: string;
  image?: string;
}

const ProductDetails = () => {
  const params = useParams();
  console.log("Params từ useParams:", params); // Debug params
  const id = params?.id; // Lấy `id` từ params
  console.log("ID sản phẩm từ useParams:", id); // Debug ID

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID sản phẩm không hợp lệ");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        console.log("Fetching product với ID:", id); // Debug API URL
        const res = await fetch(`http://localhost:4000/api/products/${id}`);

        if (!res.ok) {
          throw new Error(`Lỗi API: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        if (!data || Object.keys(data).length === 0) {
          throw new Error("Không tìm thấy sản phẩm");
        }

        setProduct(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Lỗi khi lấy sản phẩm:", error.message);
          setError(error.message);
        } else {
          console.error("Lỗi không xác định:", error);
          setError("Đã xảy ra lỗi không xác định");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center">Đang tải...</p>;
  if (error) {
    return (
      <div className="text-center text-red-500">
        {error.includes('404') ? 'Sản phẩm không tồn tại' : error}
      </div>
    );
  }
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