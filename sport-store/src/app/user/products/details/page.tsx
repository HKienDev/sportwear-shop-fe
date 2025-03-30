"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ShoppingCart, Check, Shield } from "lucide-react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  description: string;
  images: {
    main: string;
    sub: string[];
  };
  brand: string;
  stock: number;
  sku: string;
  color: string[];
  size: string[];
  tags: string[];
  ratings: {
    average: number;
    count: number;
  };
}

const ProductDetails = () => {
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) {
      setError("ID sản phẩm không hợp lệ");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetchWithAuth(`/products/${id}`);

        if (!response.success) {
          throw new Error(response.message || "Lỗi khi lấy thông tin sản phẩm");
        }

        const data = response.data as Product;
        if (!data) {
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
        {error.includes("404") ? "Sản phẩm không tồn tại" : error}
      </div>
    );
  }
  if (!product) return <p className="text-center">Không tìm thấy sản phẩm</p>;

  const discountPercentage =
    product.discountPrice &&
    Math.round(((product.price - product.discountPrice) / product.price) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      {/* Product Image Gallery */}
      <div className="space-y-4">
        <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center relative h-[500px]">
          <Image
            src={product.images.main || "/default-image.png"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-contain rounded-lg"
          />
        </div>
        <div className="flex space-x-2">
          {product.images.sub?.map((thumbnail, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-lg p-2 cursor-pointer hover:border-2 hover:border-blue-500"
            >
              <Image
                src={thumbnail}
                alt={`Thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="h-20 w-20 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
        <p className="text-gray-600 mt-2">{product.category}</p>

        {/* Price Section */}
        <div className="mt-4 flex items-center space-x-4">
          <span className="text-2xl font-bold text-red-600">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.discountPrice || product.price)}
          </span>
          {product.discountPrice && (
            <span className="text-gray-500 line-through">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product.price)}
            </span>
          )}
          {discountPercentage && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Size Selection */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Chọn kích thước</h3>
          <div className="grid grid-cols-5 gap-2">
            {product.size.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`
                  py-2 border rounded-lg 
                  ${
                    selectedSize === size
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="mt-6 flex items-center space-x-4">
          <span className="font-semibold">Số lượng:</span>
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
            >
              -
            </button>
            <span className="px-4">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            className="bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition"
            disabled={!selectedSize}
          >
            <ShoppingCart />
            <span>Thêm vào giỏ</span>
          </button>
          <button
            className="bg-green-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 transition"
            disabled={!selectedSize}
          >
            <Check />
            <span>Mua ngay</span>
          </button>
        </div>

        {/* Product Description */}
        <div className="mt-8 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Mô tả sản phẩm</h3>
          <p className="text-gray-700">{product.description}</p>
        </div>

        {/* Store Policies */}
        <div className="mt-6 space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Shield className="text-green-600" size={20} />
            <span>Nguyên hộp, đầy đủ phụ kiện từ nhà sản xuất</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="text-green-600" size={20} />
            <span>Giá sản phẩm đã bao gồm VAT</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="text-green-600" size={20} />
            <span>Bảo hành 24 tháng tại trung tâm bảo hành chính hãng</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 