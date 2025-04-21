'use client';

// pages/product/[id].js
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Truck, Shield, ArrowLeft, ArrowRight, Star } from 'lucide-react';

export default function ProductDetail() {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const productImages = [
    '/freak5.webp',
    '/freak5-2.webp',
    '/freak5-3.webp',
    '/freak5-4.webp',
  ];

  const sizes = [37, 38, 39, 40, 41, 42, 43, 44, 45];
  
  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleSizeSelect = (size: number): void => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (amount: number): void => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm">
        <Link href="/" className="text-gray-500 hover:text-red-600">Trang chủ</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link href="/giay-bong-ro" className="text-gray-500 hover:text-red-600">Giày bóng rổ</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-800 font-medium">Zoom Freak 5 EP</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="relative">
          <div className="bg-gray-50 rounded-lg overflow-hidden relative aspect-square">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={productImages[selectedImage]}
                alt="Zoom Freak 5 EP"
                width={600}
                height={600}
                className="object-contain"
                priority
              />
            </div>
            
            <button 
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Previous image"
            >
              <ArrowLeft size={20} />
            </button>
            
            <button 
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              aria-label="Next image"
            >
              <ArrowRight size={20} />
            </button>
            
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              33% off
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`border rounded-md overflow-hidden aspect-square ${
                  selectedImage === index ? 'border-red-600 ring-2 ring-red-600' : 'border-gray-200'
                }`}
              >
                <Image
                  src={image}
                  alt={`Zoom Freak 5 EP view ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" className="text-gray-300" />
            </div>
            <span className="ml-2 text-sm text-gray-500">4.0 (45 đánh giá)</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Giày bóng rổ Zoom Freak 5 EP Keep It A Buck</h1>
          
          <div className="flex items-end gap-3 mb-6">
            <span className="text-2xl font-bold text-red-600">1.000.000 VND</span>
            <span className="text-lg text-gray-500 line-through">1.500.000 VND</span>
          </div>

          <div className="h-px bg-gray-200 my-6"></div>

          {/* Color Selection */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Lựa chọn màu</h2>
            <div className="flex gap-3">
              <button className="border-2 border-red-600 rounded-full p-1">
                <div className="bg-gradient-to-r from-green-700 to-red-600 w-8 h-8 rounded-full"></div>
              </button>
              <button className="border-2 border-gray-200 rounded-full p-1 hover:border-gray-400">
                <div className="bg-gradient-to-r from-gray-700 to-gray-900 w-8 h-8 rounded-full"></div>
              </button>
              <button className="border-2 border-gray-200 rounded-full p-1 hover:border-gray-400">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-8 h-8 rounded-full"></div>
              </button>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-medium text-gray-900">Lựa chọn kích thước</h2>
              <button className="text-sm text-red-600 hover:text-red-800">Hướng dẫn chọn size</button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`py-3 border rounded-md text-center font-medium transition-colors
                    ${selectedSize === size 
                      ? 'border-red-600 bg-red-50 text-red-600' 
                      : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Số lượng</h2>
            <div className="flex items-center">
              <button 
                onClick={() => handleQuantityChange(-1)}
                className="w-10 h-10 rounded-l-md border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50"
              >
                -
              </button>
              <div className="h-10 w-16 border-t border-b border-gray-300 flex items-center justify-center text-gray-900">
                {quantity}
              </div>
              <button 
                onClick={() => handleQuantityChange(1)}
                className="w-10 h-10 rounded-r-md border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart & Buy Now */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
              disabled={!selectedSize}
            >
              <ShoppingBag size={20} />
              Mua Ngay
            </button>
            <button 
              className="flex-1 py-3 px-6 border border-red-600 text-red-600 hover:bg-red-50 font-medium rounded-md transition-colors flex items-center justify-center gap-2"
              disabled={!selectedSize}
            >
              <Heart size={20} />
              Thêm vào giỏ
            </button>
          </div>

          {/* Product Benefits */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h3 className="font-medium text-gray-900">Chính Sách Của Hàng</h3>
            <div className="flex items-start gap-3">
              <div className="text-gray-500 mt-1">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-gray-900 font-medium">Giao hàng miễn phí</p>
                <p className="text-sm text-gray-500">Với đơn hàng trên 500.000 VND</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-gray-500 mt-1">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-gray-900 font-medium">Bảo hành 24 tháng</p>
                <p className="text-sm text-gray-500">Đổi 1 trong 30 ngày nếu có lỗi từ nhà sản xuất</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-gray-500 mt-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-gray-900 font-medium">Nguyên hộp, đầy đủ phụ kiện</p>
                <p className="text-sm text-gray-500">Sản phẩm chính hãng từ nhà sản xuất</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-16">
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-8">
            <button className="text-red-600 border-b-2 border-red-600 font-medium py-4">Thông Tin Sản Phẩm</button>
            <button className="text-gray-500 hover:text-gray-700 py-4">Đánh Giá (45)</button>
            <button className="text-gray-500 hover:text-gray-700 py-4">Hỏi & Đáp (12)</button>
          </div>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-gray-600">
            Dành riêng cho những người thích chinh phục và dẫn đầu, Freak 5 chủ cuộc chơi một cách mượt mà nhất. Phần thân trên chắc chắn nhưng linh hoạt mang lại sự hỗ trợ và độ co giãn cần thiết để thực hiện những cú cắt nhanh và các động tác đầy năng động. Vì vậy, dù bạn đang phá vỡ kỷ lục hay làm đối thủ phải bối rối, bạn đều có thể di chuyển ra vào trận đấu giống như chính nhà vô địch.
          </p>
          <h3 className="text-lg font-medium mt-6 mb-4">Tính Năng Nổi Bật</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Đệm Zoom Air kép ở phần đế trước chân mang lại cảm giác phản hồi.</li>
            <li>Hệ thống dây giày thiết kế độc đáo giúp cố định bàn chân.</li>
            <li>Đế ngoài bằng cao su với họa tiết bám dính tối ưu.</li>
            <li>Lớp đệm mềm mại ôm sát cổ chân.</li>
            <li>Lưỡi gà và cổ giày có đệm mềm.</li>
          </ul>
          <h3 className="text-lg font-medium mt-6 mb-4">Thông Số Kỹ Thuật</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="font-medium">Phần trên:</p>
              <p className="text-gray-600">Lưới kỹ thuật cao với lớp phủ tổng hợp</p>
            </div>
            <div>
              <p className="font-medium">Đệm giữa:</p>
              <p className="text-gray-600">Phần đệm Phylon với hai túi Zoom Air</p>
            </div>
            <div>
              <p className="font-medium">Đế ngoài:</p>
              <p className="text-gray-600">Cao su với họa tiết bám dính đa hướng</p>
            </div>
            <div>
              <p className="font-medium">Trọng lượng:</p>
              <p className="text-gray-600">Khoảng 368g (size 42)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Sản Phẩm Tương Tự</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="group">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden relative mb-4">
                <Image 
                  src={`/images/related-product-${item}.jpg`} 
                  alt="Related Product" 
                  width={300}
                  height={300}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">Giày bóng rổ Nike Zoom Freak</h3>
              <p className="text-red-600 font-medium mt-1">1.200.000 VND</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}