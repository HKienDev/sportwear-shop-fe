// pages/product/[id].js
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Check, ShoppingBag, Heart, Star, ArrowRight } from 'lucide-react';

export default function ProductPage() {
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const product = {
    name: "Giày bóng rổ Zoom Freak 5 EP Keep It A Buck",
    category: "Giày bóng rổ",
    price: 1000000,
    originalPrice: 1500000,
    discount: 33,
    currency: "Vnd",
    sizes: [37, 38, 39, 40, 41, 42, 43, 44, 45],
    colors: ["Mặc Định"],
    images: [
      "/nike-freak-main.jpg",
      "/nike-freak-top.jpg",
      "/nike-freak-bottom.jpg",
      "/nike-freak-sole.jpg",
    ],
    description: "Dành riêng cho những người thích chinh phục và dẫn đầu, Freak 5 chủ cuộc chơi một cách mượt mà nhất. Phần thân trên chắc chắn những linh hoạt mang lại sự hỗ trợ và độ cổ giãn cần thiết để thực hiện những cú cắt nhanh và các động tác đầy năng động. Vì vậy, dù bạn đang phá vỡ kỷ lục hay làm đối thủ phải bối rối, bạn đều có thể di chuyển ra vào trận đấu giống như chính nhà vô địch.",
    rating: 4.8,
    reviews: 156,
    features: [
      { icon: "tag", text: "Nguyên hộp, đầy đủ phụ kiện từ nhà sản xuất" },
      { icon: "dollar", text: "Giá sản phẩm đã bao gồm VAT" },
      { icon: "shield", text: "Bảo hành 24 tháng tại trung tâm bảo hành Chính hãng. 1 đổi 1 trong 30 ngày nếu có lỗi phần cứng từ nhà sản xuất" },
    ]
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="w-full lg:w-3/5">
          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
            <Image
              src={product.images[currentImageIndex]}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div 
                key={index}
                className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                  currentImageIndex === index ? 'border-green-700' : 'border-transparent'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <div className="relative w-full h-full">
                  <Image 
                    src={image} 
                    alt={`${product.name} thumbnail ${index}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-2/5">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    fill={i < Math.floor(product.rating) ? "#FFC107" : "none"} 
                    stroke={i < Math.floor(product.rating) ? "#FFC107" : "#E2E8F0"}
                    className="w-4 h-4"
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">{product.rating} ({product.reviews} đánh giá)</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">
                {product.price.toLocaleString()} {product.currency}
              </span>
              <span className="ml-2 text-gray-500 line-through text-sm">
                {product.originalPrice.toLocaleString()} {product.currency}
              </span>
              <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded text-sm font-medium">
                {product.discount}% off
              </span>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Lựa chọn kích thước</h2>
            <div className="grid grid-cols-3 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`py-3 border rounded-lg text-center ${
                    selectedSize === size
                      ? 'border-green-700 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Lựa chọn màu</h2>
            <div className="grid grid-cols-3 gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className="py-3 px-4 border border-gray-300 rounded-lg text-center bg-gray-50"
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Số lượng</h2>
            <div className="flex items-center border border-gray-300 rounded-lg w-36">
              <button 
                className="px-3 py-2 text-gray-600"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                -
              </button>
              <div className="flex-1 text-center">{quantity}</div>
              <button 
                className="px-3 py-2 text-gray-600"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mb-8">
            <button className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium flex items-center justify-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Mua Ngay
            </button>
            <button className="w-full py-3 border border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Thêm vào giỏ
            </button>
            <button className="w-full py-3 border border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
              <Heart className="h-5 w-5" />
              Thêm vào yêu thích
            </button>
          </div>

          {/* Product Policy */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-4">Chính Sách Của Hàng</h3>
            <ul className="space-y-3">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-xl font-bold mb-6">Thông Tin Sản Phẩm</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      </div>

      {/* Product Recommendations */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Sản phẩm tương tự</h2>
          <a href="#" className="text-green-700 hover:text-green-800 flex items-center">
            Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="group cursor-pointer">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                <div className="relative w-full h-full">
                  <Image
                    src="/api/placeholder/300/300"
                    alt="Related product"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <h3 className="font-medium text-sm truncate">Giày bóng rổ Nike Pro Max</h3>
              <p className="text-gray-900 font-medium">1.200.000 Vnd</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}